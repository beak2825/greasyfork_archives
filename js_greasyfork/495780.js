// ==UserScript==
// @name        localImage_MP_Preview
// @namespace   leizingyiu.net
// @match       file:///*
// @grant       none
// @version     2024.5.23.10.46.59
// @author      leizingyiu
// @description 预览本地文件的微信公众号长图，在公众号里面的效果
// @license     GNU AGPLv3
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/495780/localImage_MP_Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/495780/localImage_MP_Preview.meta.js
// ==/UserScript==


javascript: (_ => {


    "title,微信公众号文章长图片预览;author,Leizingyiu;mp,Leizingyiu;date,2024-05-22 12:46;addr,广东".split(';').map(kv => {
        let [k, v] = kv.split(','), V = GM_getValue(k);
        if (V !== undefined && V !== null) { return; } else { GM_setValue(k, v); }
    });
    const title = GM_getValue('title', '微信公众号文章长图片预览'), author = GM_getValue('author', 'Leizingyiu'),
        mp = GM_getValue('mp', 'Leizingyiu'),
        date = GM_getValue('date', '2024-05-22 12:46'),
        addr = GM_getValue('addr', 'Canton');

    if(document.querySelector('img')==null){return;}

    let d = document.createElement('div');
    d.style.cssText = `
       position: fixed;
    left: 50%;
    top: 50%;
    width: min(100vw, 45.4737vh);
    height: 96vh;
    background: rgb(255, 255, 255);
    transform: translate(-50%, -50%);
    overflow-y: scroll;
    box-sizing: border-box;
    border-radius: 24px;
    padding-top: calc(min(100vw, 45.4737vh)* 186 / 750);
    -webkit-box-shadow: 0px 0px 56px 0px rgba(0,0,0,0.16);
    -moz-box-shadow: 0px 0px 56px 0px rgba(0,0,0,0.16);
    box-shadow: 0px 0px 56px 0px rgba(0,0,0,0.16);
`;
    document.body.appendChild(d);
    let svg = document.createElement('svg');
    let h1 = document.createElement('h1');
    let _d = document.createElement('div');
    let inside = document.createElement('div');
    let container = document.createElement('div');

    let svg2 = document.createElement('svg');

    d.appendChild(svg);
    d.appendChild(inside);
    inside.appendChild(container);
    container.appendChild(h1);
    container.appendChild(_d);
    d.appendChild(svg2);

    container.appendChild(document.querySelector('img'));

    inside.style.cssText = `
      height: calc(100% - min(100vw, 45.4737vh)* 186 / 750);
    overflow: scroll;
    padding: 20px 20px 6vh;
    box-sizing: border-box;
`;


    let s = document.createElement('style');
    s.innerHTML = `

*{scrollbar-width: none; /* 隐藏浏览器默认滚动条 */
  overflow: auto; /* 启用滚动功能 */
  scrollbar-color: transparent transparent; /* 滚动条颜色 */
}

img{width:100%!important;height:auto!important; position: relative!important;     pointer-events: none !important;}
body{background:#fff!important;}
`;
    document.body.appendChild(s);


    var isDragging = false;
    var startX, startY;
    var scrollLeft, scrollTop;

    container.addEventListener('mousedown', function (e) {
        console.log(e);
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = inside.scrollLeft;
        scrollTop = inside.scrollTop;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            var deltaX = e.clientX - startX;
            var deltaY = e.clientY - startY;
            inside.scrollLeft = scrollLeft - deltaX;
            inside.scrollTop = scrollTop - deltaY;
        }
    });

    document.addEventListener('mouseup', function (e) {
        isDragging = false;
    });




    svg.outerHTML = `<svg width="750" height="186" viewBox="0 0 750 186" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="
    width: 100%;
    height: auto;
    position: fixed;
    left: 0;
    top: 0;
    border-bottom: solid 1px #00000011;
">

	<g clip-path="url(#clip10_56)">
		<g opacity="0.350000">
			<path d="M638.65 44.05L673.95 44.05C677.07 44.05 679.59 46.58 679.59 49.69L679.59 62.4C679.59 65.52 677.07 68.05 673.95 68.05L638.65 68.05C635.54 68.05 633.01 65.52 633.01 62.4L633.01 49.69C633.01 46.58 635.54 44.05 638.65 44.05ZM638.65 46.16L673.95 46.16Q675.71 46.16 676.59 47.05Q677.48 47.93 677.48 49.69L677.48 62.4Q677.48 64.17 676.59 65.05Q675.71 65.93 673.95 65.93L638.65 65.93Q636.89 65.93 636.01 65.05Q635.13 64.17 635.13 62.4L635.13 49.69Q635.13 48.96 635.39 48.34Q635.64 47.72 636.16 47.2Q636.68 46.68 637.3 46.42Q637.92 46.16 638.65 46.16Z" fill="#000000" fill-opacity="1" fill-rule="evenodd"></path>
		</g>
		<g opacity="0.400000">
			<path d="M681.71 51.81L681.71 60.28C683.41 59.57 684.52 57.9 684.52 56.05C684.52 54.2 683.41 52.53 681.71 51.81Z" fill="#000000" fill-opacity="1" fill-rule="nonzero"></path>
		</g>
		<path d="M640.07 48.28L672.53 48.28C674.09 48.28 675.36 49.55 675.36 51.11L675.36 60.99C675.36 62.55 674.09 63.81 672.53 63.81L640.07 63.81C638.51 63.81 637.24 62.55 637.24 60.99L637.24 51.11C637.24 49.55 638.51 48.28 640.07 48.28Z" fill="#000000" fill-opacity="1" fill-rule="nonzero"></path>
		<path d="M619.282 44.7588L617.164 44.7588C615.995 44.7588 615.047 45.707 615.047 46.877L615.047 65.2314C615.047 66.4004 615.995 67.3486 617.164 67.3486L619.282 67.3486C620.451 67.3486 621.399 66.4004 621.399 65.2314L621.399 46.877C621.399 45.707 620.451 44.7588 619.282 44.7588ZM607.283 49.6973L609.401 49.6973C610.57 49.6973 611.518 50.6455 611.518 51.8154L611.518 65.2275C611.518 66.3975 610.57 67.3457 609.401 67.3457L607.283 67.3457C606.114 67.3457 605.166 66.3975 605.166 65.2275L605.166 51.8154C605.166 50.6455 606.114 49.6973 607.283 49.6973ZM599.52 54.6416L597.402 54.6416C596.233 54.6416 595.285 55.5898 595.285 56.7598L595.285 65.2305C595.285 66.4004 596.233 67.3486 597.402 67.3486L599.52 67.3486C600.689 67.3486 601.637 66.4004 601.637 65.2305L601.637 56.7598C601.637 55.5898 600.689 54.6416 599.52 54.6416ZM589.638 58.8779L587.52 58.8779C586.351 58.8779 585.403 59.8262 585.403 60.9951L585.403 65.2314C585.403 66.4004 586.351 67.3486 587.52 67.3486L589.638 67.3486C590.807 67.3486 591.755 66.4004 591.755 65.2314L591.755 60.9951C591.755 59.8262 590.807 58.8779 589.638 58.8779Z" clip-rule="evenodd" fill="#000000" fill-opacity="1" fill-rule="evenodd"></path>
		<path d="M94.42 54.11C94.42 61.63 91.05 66.07 85.38 66.07C81.29 66.07 78.19 63.65 77.52 59.99L81.5 59.99C82.01 61.67 83.49 62.73 85.41 62.73C88.67 62.73 90.6 59.68 90.6 54.58L90.34 54.58C89.29 56.7 87.17 57.92 84.56 57.92C80.3 57.92 77.21 54.79 77.21 50.49C77.21 45.92 80.64 42.66 85.5 42.66C88.76 42.66 91.34 44.2 92.84 47.06C93.88 48.9 94.42 51.28 94.42 54.11ZM117.89 65.52L121.71 65.52L121.71 61.36L124.72 61.36L124.72 57.99L121.71 57.99L121.71 43.21L116.08 43.21C112.14 49.15 109 54.11 106.99 57.81L106.99 61.36L117.89 61.36L117.89 65.52ZM137.21 65.52L133.22 65.52L133.22 47.23L132.96 47.23L127.41 51.13L127.41 47.29L133.24 43.21L137.21 43.21L137.21 65.52ZM81.12 50.37C81.12 52.92 82.95 54.75 85.51 54.75C88.07 54.75 89.94 52.92 89.94 50.43C89.94 47.91 88.02 45.98 85.53 45.98C83.04 45.98 81.12 47.88 81.12 50.37ZM110.68 57.85C113.28 53.28 115.6 49.61 117.73 46.46L117.95 46.46L117.95 58.09L110.68 58.09L110.68 57.85ZM103.42 51.82C103.42 53.22 102.41 54.25 100.94 54.25C99.49 54.25 98.47 53.22 98.47 51.82C98.47 50.42 99.49 49.38 100.94 49.38C102.41 49.38 103.42 50.42 103.42 51.82ZM103.42 63.41C103.42 64.8 102.41 65.85 100.94 65.85C99.49 65.85 98.47 64.8 98.47 63.41C98.47 62 99.49 60.96 100.94 60.96C102.41 60.96 103.42 62 103.42 63.41Z" fill="#000000" fill-opacity="1" fill-rule="evenodd"></path>
	</g>
	<line x1="40" y1="132" x2="63" y2="155" stroke="#313131" stroke-opacity="1" stroke-width="2"></line>
	<line x1="63" y1="132" x2="40" y2="155" stroke="#313131" stroke-opacity="1" stroke-width="2"></line>
	<circle cx="686" cy="144" r="3" fill="#313131" fill-opacity="1"></circle>
	<circle cx="698" cy="144" r="3" fill="#313131" fill-opacity="1"></circle>
	<circle cx="710" cy="144" r="3" fill="#313131" fill-opacity="1"></circle>
	<rect x="191" y="20" rx="36" width="360" height="72" fill="#000000" fill-opacity="1"></rect>
	<rect x="208" y="34" rx="10" width="45" height="45" fill="#E6E5E7" fill-opacity="1"></rect>
	<path d="M496 53L496 60" stroke="#88888A" stroke-opacity="1" stroke-width="4" stroke-linecap="round"></path>
	<path d="M503 50L503 63" stroke="#88888A" stroke-opacity="1" stroke-width="4" stroke-linecap="round"></path>
	<path d="M510 51L510 62" stroke="#88888A" stroke-opacity="1" stroke-width="4" stroke-linecap="round"></path>
	<path d="M517 46.98L517 66.01" stroke="#88888A" stroke-opacity="1" stroke-width="4" stroke-linecap="round"></path>
	<path d="M524 53L524 60" stroke="#88888A" stroke-opacity="1" stroke-width="4" stroke-linecap="round"></path>
	<path d="M531 55L531 58" stroke="#88888A" stroke-opacity="1" stroke-width="4" stroke-linecap="round"></path>
</svg>`;

    h1.outerHTML = `<h1 class="rich_media_title " id="activity-name" style="margin: 0px 0px 14px; padding: 0px; outline: 0px; font-weight: 400; font-size: 22px; line-height: 1.4; color: rgba(0, 0, 0, 0.9); font-family: system-ui, -apple-system, &quot;system-ui&quot;, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif; letter-spacing: 0.544px; background-color: rgb(255, 255, 255);">${title}</h1>`;

    _d.outerHTML = `<div contenteditable="true" style="margin:0 0 22px;padding:0;outline:0;line-height:20px;font-size:0;overflow-wrap:break-word;hyphens:auto;position:relative;z-index:1"><span contenteditable="true" style="--weui-FG-2:rgba(0, 0, 0, 0.3);margin:0 10px 10px 0;padding:0;outline:0;display:inline-block;vertical-align:middle;font-size:15px;-webkit-tap-highlight-color:transparent;color:var(--weui-FG-2)"><span contenteditable="true" role="link" tabindex="0" id="js_author_name" class="wx_tap_link js_wx_tap_highlight weui-wa-hotarea" datarewardsn="" datatimestamp="" datacanreward="0" style="margin:0;padding:0;outline:0;position:relative">${author}</span></span><span contenteditable="true" style="--weui-LINK:#576b95;margin:0 10px 10px 0;padding:0;outline:0;display:inline-block;vertical-align:middle;font-size:15px;-webkit-tap-highlight-color:transparent;position:relative"><a contenteditable="true" style="margin:0;padding:0;outline:0;color:var(--weui-LINK);-webkit-tap-highlight-color:transparent;-webkit-user-drag:none;cursor:pointer;position:relative">${mp}</a></span>&nbsp;<span style="margin:0;padding:0;outline:0"><span contenteditable="true" style="--weui-FG-2:rgba(0, 0, 0, 0.3);margin:0 10px 10px 0;padding:0;outline:0;display:inline-block;vertical-align:middle;font-size:15px;-webkit-tap-highlight-color:transparent;color:var(--weui-FG-2)">${date}</span>&nbsp;<span contenteditable="true" role="option" aria-labelledby="js_a11y_op_ip_wording js_ip_wording" style="--weui-FG-2:rgba(0, 0, 0, 0.3);margin:0 10px 10px 0;padding:0;outline:0;display:inline-block;vertical-align:middle;font-size:15px;-webkit-tap-highlight-color:transparent;color:var(--weui-FG-2)"><span contenteditable="true" style="margin:0;padding:0;outline:0">${addr}</span></span></span></div>`;

    svg2.outerHTML = `
<svg width="750" height="166" viewBox="0 0 750 166" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="
    width: 100%;
    height: auto;
    bottom: 0;
    left: 0;
    position: fixed;
    z-index: 999;
">
	<g clip-path="url(#clip10_117)">
		<rect width="750" height="166" fill="#FFFFFF" fill-opacity="1"></rect>
		<path d="M608.03 36.02L594.5 49.55L594.5 41.5C594.5 41.5 589 42 585 45C580.99 48 578 54 578 54C578 54 576 42.04 581.5 36.02C587 30 594.5 31 594.5 31L594.5 22.49L608.03 36.02Z" stroke="#1C1C1C" stroke-opacity="1" stroke-width="2" stroke-linejoin="round"></path>
		<path d="M669.81 25.44C669.69 25.55 669.55 25.63 669.39 25.68L661.4 27.98C660.88 28.13 660.58 28.66 660.71 29.18L662.71 37.25C662.75 37.41 662.75 37.58 662.71 37.74L660.71 45.81C660.58 46.33 660.88 46.86 661.4 47.01L669.39 49.31C669.55 49.36 669.69 49.44 669.81 49.55L675.8 55.33C676.19 55.7 676.8 55.7 677.19 55.33L683.18 49.55C683.3 49.44 683.44 49.36 683.6 49.31L691.59 47.01C692.11 46.86 692.41 46.33 692.29 45.81L690.28 37.74C690.24 37.58 690.24 37.41 690.28 37.25L692.29 29.18C692.41 28.66 692.11 28.13 691.59 27.98L683.6 25.68C683.44 25.63 683.3 25.55 683.18 25.44L677.19 19.66C676.8 19.29 676.19 19.29 675.8 19.66L669.81 25.44Z" stroke="#1C1C1C" stroke-opacity="1" stroke-width="2"></path>
		<path d="M669.09 33.12C669.08 33.45 668.9 33.75 668.62 33.93L663.71 37C663.08 37.39 663.08 38.3 663.71 38.7L668.62 41.77C668.9 41.94 669.08 42.25 669.09 42.58L669.29 48.37C669.32 49.11 670.11 49.57 670.76 49.22L675.88 46.5C676.17 46.34 676.52 46.34 676.82 46.5L681.93 49.22C682.59 49.57 683.38 49.11 683.4 48.37L683.6 42.58C683.62 42.25 683.79 41.94 684.07 41.77L688.99 38.7C689.62 38.3 689.62 37.39 688.99 37L684.07 33.93C683.79 33.75 683.62 33.45 683.6 33.12L683.4 27.32C683.38 26.58 682.59 26.13 681.93 26.48L676.82 29.2C676.52 29.35 676.17 29.35 675.88 29.2L670.76 26.48C670.11 26.13 669.32 26.58 669.29 27.32L669.09 33.12Z" stroke="#1C1C1C" stroke-opacity="1" stroke-width="2"></path>
		<path d="M500 34L500 51L496 51C494.89 51 494 50.1 494 49L494 36C494 34.89 494.89 34 496 34L500 34Z" stroke="#1C1C1C" stroke-opacity="1" stroke-width="2"></path>
		<path d="M500 51L515.52 51C518.41 51 520.88 48.94 521.42 46.11L523.1 37.24C523.56 34.78 521.68 32.5 519.17 32.5L515 32.5C513.89 32.5 513 31.6 513 30.5L513 24.27C513 23.76 512.85 23.27 512.58 22.84C511.58 21.23 509.27 21.13 508.13 22.65C507.72 23.2 507.5 23.87 507.5 24.55L507.5 26.01C507.5 30.22 504.23 33.71 500.03 33.99L500 34L500 51Z" stroke="#1C1C1C" stroke-opacity="1" stroke-width="2"></path>




		<rect x="252" y="32" rx="8" width="83" height="47" fill="#F7F7F7" fill-opacity="0"></rect>

		<circle cx="67" cy="55" r="29" fill="#64C5F7" fill-opacity="1"></circle>
		<rect x="241" y="141" rx="5" width="268" height="10" fill="#000000" fill-opacity="1"></rect>

    <foreignObject x="0" y="0" width="750" height="166">
        <p style="
    left: 110px;
    right: 51px;
    top: 32px;
    bottom: -14px;
    position: absolute;
    height: 40px;
    color: rgb(27, 27, 27);
    font-family: 思源黑体;
    font-size: 28px;
    font-weight: 400;
     letter-spacing: 0px;
    text-align: left;
    line-height: 1em;
    margin: 5px 0;
    overflow: visible;
">${author}<span style="
    font-size: 0.9em;
    padding: 0.4em 0.4em;
    background: #f7f7f7;
    border: 8px;
    /* vertical-align: sub; */
    margin-left: 0.4em;
">+关注</span></p>
    </foreignObject>
	<foreignObject x="0" y="-17" width="750" height="166">
        <p style="left: 498px;
right: 232px;
top: 61px;
bottom: 76px;
position: absolute;
width: 20px;
height: 29px;
color: rgb(27, 27, 27);
font-family: 思源黑体;
font-size: 20px;
font-weight: 400;
line-height: 29px;
letter-spacing: 0px;
text-align: center;
">赞</p>
    <p style="left: 572px;
right: 138px;
top: 61px;
bottom: 76px;
position: absolute;
width: 40px;
height: 29px;
color: rgb(27, 27, 27);
font-family: 思源黑体;
font-size: 20px;
font-weight: 400;
line-height: 29px;
letter-spacing: 0px;
text-align: center;
">分享</p><p style="left: 655px;
right: 55px;
top: 61px;
bottom: 76px;
position: absolute;
width: 40px;
height: 29px;
color: rgb(27, 27, 27);
font-family: 思源黑体;
font-size: 20px;
font-weight: 400;
line-height: 29px;
letter-spacing: 0px;
text-align: center;
">在看</p></foreignObject></g>
</svg>

`;

    [...document.querySelectorAll('span,h1,p')].map(_ => { _.setAttribute('contenteditable', "true") });
})()