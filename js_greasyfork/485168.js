// ==UserScript==
// @name           CopyTextFromXPath
// @version        1.0.0
// @author         Flik
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_getResourceText
// @match          *://app.jazz.co/*
// @require        https://code.jquery.com/jquery-3.5.1.min.js
// @require        https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery-xpath/0.3.1/jquery.xpath.js
// @resource CSS   https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.css
// @icon data:image/png;base64,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
// @namespace https://greasyfork.org/users/1249923
// @description JazzHr 便捷工具🔧
// @downloadURL https://update.greasyfork.org/scripts/485168/CopyTextFromXPath.user.js
// @updateURL https://update.greasyfork.org/scripts/485168/CopyTextFromXPath.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("CSS"));
(function () {
    'use strict';
    toastr.options.positionClass = "toast-bottom-left"

    let baseUrl ="https://plus.92coco.cn:8443/prod-api";
    // let baseUrl = "http://127.0.0.1:8080";
    let timer = null;
    let lastURL = location.href;
    new MutationObserver(() => {
        if (location.href != lastURL) {
            lastURL = location.href;
            onUrlChange();
        }
    }).observe(document, {subtree: true, childList: true});

    let info_xpath = {
        name: "//h1[@class='candidate-name fs-data-mask ng-binding']",
        email: "//li[@class='meta-email text-ellipsis']/jz-candidate-email[@class='ng-isolate-scope']/a[@class='ng-binding']/text()",
        phoneNumber: "//li[@class='meta-phone text-ellipsis ng-scope']/a[@class='ng-binding']/text()",
        job:"//span[contains(@class,'jz-filter-dropdown-toggle-text')]/text()",
        source: "//li[@class='meta-source text-ellipsis']/span[@class='ng-binding']/text()",
        dateApplied: "//form[@id='candidateInfoEditForm']/div[@class='col-xs-6'][2]/div[@class='form-section']/div[@class='form-group'][1]/p[@class='form-control-static ng-binding']/text()",
        address: "//li[@class='meta-location text-ellipsis ng-scope']/span[@class='ng-binding']/text()",
        resumeUrl: "//jz-resume-viewer//iframe",
        //website:"",
        allButton: "//div[@class='jz-candidate-application-bar-actions']//a",
        screenButton: "//div[@class='jz-candidate-application-bar-actions']//a[@data-test='transition-to-Screen']",
        interviewButton: "//div[@class='jz-candidate-application-bar-actions']//a[@data-test='transition-to-Interview']",
        considerButton: "//div[@class='jz-candidate-application-bar-actions']//a[@data-test='transition-to-Consider']",
        offerButton: "//div[@class='jz-candidate-application-bar-actions']//a[@data-test='transition-to-Offer']",
        noHiredButton: "//div[@class='jz-candidate-application-bar-actions']//a[@data-test='transition-to-Not Hired']",
        newButton: "//div[contains(@class,'jz-candidate-application-bar-actions')]//a[@data-test='transition-to-New']",
    }

    if (lastURL.endsWith("profile")) {
        onUrlChange()
    }

    function onUrlChange() {
        waitForElement("ui-view div.candidate-name-wrap", function () {
            addCopyButton()
            addPostInfoButton()
            bindClickEvent()
        }, 1000)
    }

    function waitForElement(selector, callback, interval) {
        if (window.location.href.includes("pdfjs/web/viewer")) {
            return
        }
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(function () {
            console.log("wait...")
            if ($(selector).length) {
                console.log("wait success")
                clearInterval(timer);
                callback();
            }
        }, interval);
    }


    function addCopyButton() {
        let copy_paths = [
            // 在这里添加你的xpath路径
            '//h1[contains(@class,"candidate-name")]',
            "//jz-candidate-email[@class='ng-isolate-scope']/a[@class='ng-binding']/text()",
            "//li[@class='meta-phone text-ellipsis ng-scope']/a[@class='ng-binding']/text()",
        ];
        if (!window.location.href.endsWith("profile") || $('#copy-button, #toast').length) {
            return
        }
        $("#copy-button").remove()
        $('body div.candidate-name-wrap').append('<button id="copy-button" class="btn btn-primary">Copy</button>');

        $('#copy-button').click(function () {
            let result = '';
            copy_paths.forEach((path) => {
                let element = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (element) {
                    result += element.textContent + '	';
                }
            });
            console.log("copy...	", result)
            navigator.clipboard.writeText(result);
            toastr.success("Copy Success!!!", "Hi!");
        });
    }

    function addPostInfoButton() {
        let buttonId = "#postInfo-button";
        if (!window.location.href.endsWith("profile") || $(buttonId).length) {
            return
        }
        $(buttonId).remove()
        $('body div.candidate-name-wrap').append('<button id="postInfo-button" type="" class="btn btn-primary">Post Info</button>');
        $(buttonId).click(function (e) {
            postInfo(e)
        });
    }

    function bindEvent(buttonId) {
        var $button = $(document).xpath(buttonId);
        if ($button.length && $._data($button[0], "events") && $._data($button[0], "events")['click'] && $._data($button[0], "events")['click'].some(function (obj) {
            return obj.namespace === "myClickEvent";
        })) {
            // 如果已存在 'click.myClickEvent' 事件，就不再进行添加
            return;
        }
        console.log($button.text(), "增加点击事件");
        $button.on('click.myClickEvent', function (e) {
            postInfo(e)
            setTimeout(function () {
                bindClickEvent()
            }, 500)
        });
    }

    function bindClickEvent() {
        // bindEvent(info_xpath['allButton'])
        bindEvent(info_xpath['screenButton']);
        bindEvent(info_xpath['interviewButton']);
        bindEvent(info_xpath['considerButton']);
        bindEvent(info_xpath['offerButton']);
        bindEvent(info_xpath['noHiredButton']);
        bindEvent(info_xpath['newButton']);
    }

    function postInfo(event) {
        let data = {
            name: $(document).xpath(info_xpath['name']).text(),
            email: $(document).xpath(info_xpath['email']).text(),
            phoneNumber: $(document).xpath(info_xpath['phoneNumber']).text(),
            job:$(document).xpath(info_xpath['job']).text(),
            source: $(document).xpath(info_xpath['source']).text(),
            dateApplied: $(document).xpath(info_xpath['dateApplied']).text(),
            address: $(document).xpath(info_xpath['address']).text(),
            resumeUrl: $(document).xpath(info_xpath['resumeUrl']).get(0).src,
            status: $(event.target).text(),
            website: window.location.host,
            otherInfo: window.location.href,
        }
        let {name,status, phoneNumber} = data;
        if (!status) {
            toastr.error("脚本出现异常。")
        }
        // 如果修改状态为new
        if (status.toLowerCase().includes("new")) {
            $.ajax({
                url: baseUrl + "/system/resume/delete/" + phoneNumber,
                type: "get",
                success: function (res) {
                    if (res.code != 200) {
                        toastr.error(res.msg);
                        return
                    }
                    toastr.success('已将 '+name+" 的数据移除")
                },
                error: function (xhr, status, error) {
                    // 处理请求错误的回调函数
                    console.log(error);
                    toastr.error(error, xhr, status);
                }
            });
            return
        }

        let url = baseUrl + "/system/resume";
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (res) {
                if (res.code != 200) {
                    toastr.error(res.msg);
                    return
                }
                toastr.success("用户：" + data.name + "， 提交成功,状态：" + status);
            },
            error: function (xhr, status, error) {
                // 处理请求错误的回调函数
                console.log(error);
                toastr.error(error);
            }
        });
    }
})();


