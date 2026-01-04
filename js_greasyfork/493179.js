// ==UserScript==
// @name         「Ele-Cat」ChatGPT anywhere
// @namespace    https://ele-cat.gitee.io/
// @version      0.0.2
// @description  出神入化-ChatGPT anywhere
// @author       Ele-Cat
// @match        *://*/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/493179/%E3%80%8CEle-Cat%E3%80%8DChatGPT%20anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/493179/%E3%80%8CEle-Cat%E3%80%8DChatGPT%20anywhere.meta.js
// ==/UserScript==

(function () {
    "use strict";

    GM_addStyle(
        `#popupButton:hover {
            background-color: rgba(152, 195, 106, 1) !important;
        }
        #closeButton:hover #close-icon{
            fill: #fff !important;
        }
        .flex.items-center.flex-col.justify-center.mt-4.text-center {
            display: none !important;
        }
        .n-config-provider>div {
            padding: 0 !important;
        }
        .flex-1.min-h-0.pb-4.overflow-hidden+.p-4 {
            display: none !important;
        }
        .flex.items-center.justify-between.space-x-2>div:nth-of-type(1), .flex.items-center.justify-between.space-x-2>div:nth-of-type(2), .flex.items-center.justify-between.space-x-2>div:nth-of-type(5) {
            display: none !important;
        }
        .home_sidebar__fPZfq{
            width: 240px;
        }
        .home_window-content__2WGYf{
            flex: 1;
        }`
    );

    $(document).ready(function () {
        // 创建按钮
        let $button = $('<div id="popupButton" title="点击打开ChatGPT"></div>');
        $button.css({
            position: "fixed",
            bottom: "12px",
            left: "12px",
            zIndex: "999999999",
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(152, 195, 106, 0.85)",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.3)",
            transtion: "all .8s",
        });
        // 按钮图标
        let $gptIcon = $(
            '<svg id="gpt-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1456" width="64" height="64"><path d="M956.408445 419.226665a250.670939 250.670939 0 0 0-22.425219-209.609236A263.163526 263.163526 0 0 0 652.490412 85.715535 259.784384 259.784384 0 0 0 457.728923 0.008192a261.422756 261.422756 0 0 0-249.44216 178.582564 258.453206 258.453206 0 0 0-172.848261 123.901894c-57.03583 96.868753-44.031251 219.132275 32.153053 302.279661a250.670939 250.670939 0 0 0 22.32282 209.609237 263.163526 263.163526 0 0 0 281.595213 123.901893A259.067596 259.067596 0 0 0 566.271077 1023.990784a260.60357 260.60357 0 0 0 249.339762-178.889759 258.453206 258.453206 0 0 0 172.848261-123.901893c57.445423-96.868753 44.13365-218.82508-32.050655-302.074865zM566.578272 957.124721c-45.362429 0-89.496079-15.666934-124.516283-44.543243 1.638372-0.921584 4.198329-2.150363 6.143895-3.481541l206.537289-117.757998a32.35785 32.35785 0 0 0 16.895713-29.081105V474.82892l87.243317 49.97035c1.023983 0.307195 1.638372 1.228779 1.638372 2.252762v238.075953c0 105.8798-86.936122 191.689541-193.942303 191.996736zM148.588578 781.102113a189.846373 189.846373 0 0 1-23.346803-128.612213c1.535974 1.023983 4.09593 2.559956 6.143895 3.48154L337.922959 773.729439c10.444622 6.143896 23.346803 6.143896 34.098621 0l252.30931-143.664758v99.531108c0 1.023983-0.307195 1.945567-1.331177 2.559956l-208.892449 118.986778a196.297463 196.297463 0 0 1-265.518686-70.04041zM94.112704 335.97688c22.630015-39.013737 58.367008-68.81163 101.16948-84.171369V494.591784c0 11.7758 6.45109 22.93721 16.793315 28.978707l252.30931 143.767156L377.141493 716.796006a3.174346 3.174346 0 0 1-2.867152 0.307195l-208.892448-118.986777A190.870355 190.870355 0 0 1 94.215102 335.874482z m717.607001 164.861198L559.410394 357.070922 646.653711 307.20297a3.174346 3.174346 0 0 1 2.969549-0.307195l208.892449 118.986777a190.358364 190.358364 0 0 1 70.961994 262.139544 194.556693 194.556693 0 0 1-101.16948 84.171369V529.407192a31.538664 31.538664 0 0 0-16.588518-28.671513z m87.03852-129.329002c-1.74077-1.023983-4.300727-2.559956-6.246294-3.48154l-206.639687-117.757999a34.09862 34.09862 0 0 0-33.996222 0L399.566711 393.934295v-99.531108c0-1.023983 0.307195-1.945567 1.331178-2.559956l208.892449-119.089176a195.990268 195.990268 0 0 1 265.518686 70.450003c22.732414 38.706542 31.129071 84.171369 23.346803 128.305018zM352.258716 548.862861l-87.243317-49.560757a2.457558 2.457558 0 0 1-1.638372-2.252762V258.870991c0-105.8798 87.243317-191.996736 194.556692-191.689541a194.556693 194.556693 0 0 1 124.209089 44.543243c-1.638372 0.921584-4.198329 2.252762-6.143896 3.48154l-206.639687 117.757999a31.948257 31.948257 0 0 0-16.793315 29.081105l-0.307194 286.715126z m47.307995-100.759887L512 384.001664l112.535687 63.998912v127.997824l-112.228492 63.998912-112.535687-63.998912-0.307195-127.997824z" p-id="1457"></path></svg>'
        );
        $gptIcon.css({
            width: "32px",
            fill: "#fff",
            pointerEvents: "none",
        });
        // 图标添加至按钮
        $button.append($gptIcon);
        if (window.self === window.top) {
            // 如果不是iframe页，将按钮添加至页面
            $("body").append($button);
        } else {
            // 是iframe页就不继续执行下面代码了
            return false;
        }
        // gpt地址
        let gptUrl = "https://chat18.aichatos.xyz";
        // 创建弹窗
        let $popup = $(
            '<div id="popupContainer"></div>'
        );
        $popup.css({
            display: "none",
            position: "fixed",
            left: "50px",
            bottom: "50px",
            zIndex: 9998,
            backgroundColor: "#fff",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.3)",
        });
        // 创建iframe
        let $iframe = $(`<iframe src="${gptUrl}"></iframe>`);
        $iframe.css({
            width: "1200px",
            height: "600px",
            maxWidth: "80vw",
            maxHeight: "80vh",
            border: "none",
        });
        // 创建关闭按钮
        let $closeButton = $('<div id="closeButton" title="关闭"></div>');
        $closeButton.css({
            position: "absolute",
            top: 0,
            right: 0,
            width: "32px",
            height: "32px",
            backgroundColor: "red",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "0 0 0 16px",
            cursor: "pointer",
        });
        // 关闭图标
        let $closeIcon = $('<svg id="close-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4248" width="32" height="32"><path d="M0 0h1024v1024H0z" fill-opacity="0" p-id="4249"></path><path d="M240.448 168l2.346667 2.154667 289.92 289.941333 279.253333-279.253333a42.666667 42.666667 0 0 1 62.506667 58.026666l-2.133334 2.346667-279.296 279.210667 279.274667 279.253333a42.666667 42.666667 0 0 1-58.005333 62.528l-2.346667-2.176-279.253333-279.253333-289.92 289.962666a42.666667 42.666667 0 0 1-62.506667-58.005333l2.154667-2.346667 289.941333-289.962666-289.92-289.92a42.666667 42.666667 0 0 1 57.984-62.506667z" p-id="4250"></path></svg>');
        $closeIcon.css({
            width: "24px",
            fill: "#fafafa",
            position: "relative",
            top: "-2px",
            right: "-2px",
            pointerEvents: "none",
        })
        $closeButton.append($closeIcon);
        $popup.append($iframe);
        $popup.append($closeButton);
        $("body").append($popup);

        // 点击按钮显示弹窗
        $button.click(function () {
            $popup.show();
            $("body").css({overflow: "hidden"})
        });
        $(document).click(function (event) {
            if (
                !$(event.target).closest("#popupContainer").length &&
                !$(event.target).is("#popupButton")
            ) {
                $popup.hide();
                $("body").css({overflow: "auto"})
            }
        });

        $closeButton.click(function () {
            $popup.hide();
            $("body").css({overflow: "auto"})
        });
    });
})();