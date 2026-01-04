// ==UserScript==
// @name         保密答题
// @version      0.1
// @description  2024年保密教育线上答题
// @author       ss
// @run-at       document-end
// @match        https://www.baomi.org.cn/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1300844
// @downloadURL https://update.greasyfork.org/scripts/501638/%E4%BF%9D%E5%AF%86%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/501638/%E4%BF%9D%E5%AF%86%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log("baomi_script start run");
    var $ = window.jQuery;

    class ModifiedHttpRequest extends XMLHttpRequest {
        constructor() {
            // 调用父类的constructor
            super();
            // 保存原始的open方法
            this.originalOpen = this.open;
            // 替换原始的open方法
            this.open = this.modifiedOpen;
            // 存储原始响应数据
            this._originalResponseText = null;
        }

        modifiedOpen(method, url, async, user, password) {
            this.addEventListener("readystatechange", () => {
                if (this.readyState === 4) {
                    // 当请求完成时，首先存储原始响应数据
                    this._originalResponseText = this.responseText;

                    if (this._originalResponseText.startsWith('{')) {
                        let res = JSON.parse(this._originalResponseText)
                        if (res.data != null && res.data != undefined) {
                            let keys = Object.keys(res.data)
                            for (let i = 0; i < keys.length; i++) {
                                //if (keys[i].includes('Grade') || keys[i].includes('grade')) {
                                //    console.log("--------------------Key:", keys[i], "Value:", res.data[keys[i]]);
                                // }
                                // 修改学时
                                if (keys[i] === 'totalGrade') {
                                    res.data[keys[i]] = 4
                                    console.log("修改学时完成...");
                                }
                            }
                            this._originalResponseText = JSON.stringify(res)
                        }

                    }
                    if (/exam\/getExamContentData.do/g.test(url)) {
                        console.log("考试开始");
                        let res = JSON.parse(this._originalResponseText)
                        let typeList = res.data.typeList
                        for (let i = 0; i < typeList.length; i++) {
                            let questionList = typeList[i].questionList
                            for (let i = 0; i < questionList.length; i++) {
                                let question = questionList[i]
                                question.content = question.content.replace('</XHTML>', question.answer + ' </XHTML>')
                                console.log("展示答案完成...");
                            }

                        }
                        this._originalResponseText = JSON.stringify(res)
                    }


                    // 当请求完成时，修改responseText
                    Object.defineProperty(this, 'responseText', {
                        get: () => {
                            // 这里可以根据需要修改原始的响应数据
                            return this._originalResponseText;
                        },
                        configurable: true
                    });
                }
            });

            // 调用原始的open方法
            this.originalOpen(method, url, async, user, password);
        }
    }

    window.XMLHttpRequest = ModifiedHttpRequest;

})();