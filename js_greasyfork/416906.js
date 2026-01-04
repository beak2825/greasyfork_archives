// ==UserScript==
// @name         Auto Convertor for Stoplight
// @namespace    https://wecando.cc/
// @version      2.0.0
// @description  try to take over the world!
// @author       sadhu
// @match        https://automizely.stoplight.io/docs/developers-mobile-aftershipapi-com-tracking/*
// @match        https://automizely.stoplight.io/docs/developers-product-automizelyapi-com-shopping/*
// @require		 https://cdn.bootcss.com/jquery/3.2.1/jquery.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.0/highlight.min.js
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @resource     IMPORTED_CSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.0/styles/default.min.css
// @license      GPL License
// @grant        GM_download
// @grant        GM_log
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @connect      oschina.net
// @connect      jsonschema2pojo.org
// @downloadURL https://update.greasyfork.org/scripts/416906/Auto%20Convertor%20for%20Stoplight.user.js
// @updateURL https://update.greasyfork.org/scripts/416906/Auto%20Convertor%20for%20Stoplight.meta.js
// ==/UserScript==

var responseJson;

(function () {
    'use strict';
    // Your code here...
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    hljs.initHighlightingOnLoad();
    var originalFetch = fetch;
    unsafeWindow.fetch = (input, init) => {
        return originalFetch(input, init).then(response => {
            // it is not important to create new Promise in ctor, we can await existing one, then wrap result into new one
            return new Promise((resolve) => {
                response.clone() // we can invoke `json()` only once, but clone do the trick
                    .json()
                    .then(json => {
                        // do what ever you want with response, even `resolve(new Response(body, options));`
                        if (json.hasOwnProperty("data")) {
                            let data = json.data;
                            if (data.hasOwnProperty("bundledBranchNode")) {
                                try {
                                    responseJson = JSON.parse(data.bundledBranchNode.data);
                                    console.log("================================")
                                    console.log(responseJson)
                                    if (responseJson.responses[0].contents[0].schema.properties.hasOwnProperty("data")
                                        || !responseJson.responses[0].contents[0].schema.properties.hasOwnProperty("meta")) {
                                        waitForKeyElements(".SectionTitle.pl-1.pb-3.text-lg.font-medium.text-gray-7", responseCallbackFunction);
                                    } else {
                                        $("#myBtn").remove();
                                    }
                                }
                                catch (err) {
                                    console.log(err)
                                } finally {
                                    resolve(response);
                                }

                            }
                        } else {
                            resolve(response);
                        }

                    });
            });
        });
    };







    GM_addStyle('#myBtn{color: white;width: 100px;height: 36px;background: #3385ff;border-bottom: 1px solid #2d7');
    GM_addStyle('.sweet_custom_content{ text-align: left; font-size: 0.1rem;}');

    GM_addStyle('.sweet_custom_popup{ width: auto !important;}');
    GM_addStyle('pre{ overflow: auto;min-height: 100px;max-height: 50rem;}');
    function responseCallbackFunction(jNode) {
        if (jNode.text() == "Responses") {
            var html = "<input type='button' id='myBtn' value='预览' />";
            jNode.append(html);
            // 定义按钮事件
            $("#myBtn").click(function () {
                // let javaCode = generateAndroidBean(false);
                // formatJavaCode(javaCode);
                let jsonSchema = responseJson.responses[0].contents[0].schema.properties.data
                jsonSchema.__bundled__ = responseJson.__bundled__
                console.log(JSON.stringify(jsonSchema))
                showResult(jsonSchema)
            });
        }
    };


    /**
     *
     * 预览结果
     * @param {jsonSchema} jsonSchema
     */
    function showResult(jsonSchema) {
        copyCode = ''
        let footer = `<input type="radio" name="checkboxType" value="Java" >Java<input type="radio" name="checkboxType" value="Kotlin" >Kotlin<input type="radio" name="checkboxType" value="swift" >swift`
        Swal.fire({
            html: '<pre><code id="codelang"></code></pre>',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Copy',
            footer: footer,
            customClass: {
                popup: 'sweet_custom_popup',
                content: 'sweet_custom_content'
            },
            willOpen: () => {
                // 设置默认选中的radio
                let codeType = GM_getValue('checkboxType')
                if (isEmpty(codeType)) {
                    codeType = 'Java'
                }
                $(`input[name=checkboxType][value=${codeType}]`).attr("checked", 'checked');
                $("input:radio[name='checkboxType']").change(function () {
                    console.log(this.value)
                    GM_setValue('checkboxType', this.value)
                });

                let data = String.raw`schema=${JSON.stringify(jsonSchema)}&useprimitives=true&targetpackage=com.example&classname=Example&targetlanguage=java&sourcetype=jsonschema&annotationstyle=gson&usedoublenumbers=true&includeaccessors=true&includeadditionalproperties=true&propertyworddelimiters=-+_`
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://www.jsonschema2pojo.org/generator/preview",
                    data: data,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function (response) {
                        console.log(response.responseText)
                        if (!isEmpty(response.responseText)) {
                            // 高亮格式化代码
                            // let highCode = hljs.highlightAuto(response.responseText.replaceAll(/@Expose\n/gm, '')).value;
                            copyCode = response.responseText;
                            $("#codelang").html(hljs.highlightAuto(response.responseText).value);
                        } else {
                            showError();
                        }

                    }
                });

            }
        }).then((result) => {
            if (result.isConfirmed && !isEmpty(copyCode)) {
                GM_setClipboard(copyCode)
            }
        })

    }

    function isEmpty(obj) {
        if (typeof obj == "undefined" || obj == null || obj == "") {
            return true;
        } else {
            return false;
        }
    }



    function showError() {
        Swal.fire(
            '格式化错误',
            '格式化错误,生成的原始代码有问题, 请联系开发者修复该问题.',
            'error'
        )
    }

    let copyCode = ''


})();