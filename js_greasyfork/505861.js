// ==UserScript==

// @namespace         https://greasyfork.org/zh-CN/users/1231460-3zllm

// @name              搜索引擎语法插件
// @name:en           search engine grammer plugins
// @name:zh           搜索引擎语法插件

// @description       更便捷地使用搜索引擎语法，以实现一些过滤功能
// @description:en    More convenient use of search engine syntax to achieve some filtering functions
// @description:zh    更便捷地使用搜索引擎语法，以实现一些过滤功能

// @license           MIT

// @include         /https?://www\.google\.com[\w.]*(/search.*)?/
// @include         /https?://www\.bing\.com(/search.*)?/
// @include         /https?://cn\.bing\.com(/search.*)?/

// @version 0.0.1.20250118083902
// @downloadURL https://update.greasyfork.org/scripts/505861/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%AF%AD%E6%B3%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/505861/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%AF%AD%E6%B3%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function(){

    class Handler{
        getInputElement(){}

        /**
         * 
         * @param {Element} e 输入框
         * @param {string} value 更新后的文本
         */
        setSearchValue(e, value){}

        /**
         * @returns 元素中的搜索字符
         */
        getSearchValue(e){}
    }

    /** 搜索框输入元素 */
    const Bing = {
        getInputElement: () => document.querySelector("#sb_form_q"),
        setSearchValue: (e, value) => e.value = value,
        getSearchValue: (e) => e.value,
    }
    const Google = {  // google 使用 textarea
        getInputElement: () => document.querySelector("#APjFqb"),
        setSearchValue: (e, value) => e.value = value,
        getSearchValue: (e) => e.value
    }
    

    /** 
     * 搜索引擎语法 的文本
     * TODO 准备通过 UI 来接收用户输入
     */
    let textPatch = ""

    /** 基本功能测试 */
    class Test{

        appendText = " 我"

        static testGetText() {
            document.body.onkeyup = (ev) => {
                let code = ev.code
                console.log(code);
                if (code == "F1") {
                    alert(getBingInputElement().value)
                }
            }
        }

        /**
         * 输入内容时，添加搜索语法
         */
        static modifyText() {
            getBingInputElement().oninput = (ev) => {
                let e = getBingInputElement()
                let v = e.value
                if (!v.endsWith(appendText)) {
                    e.value += appendText
                    console.log("appended! ", e.value);
                }else{
                    console.log(e.value)
                }
            }
        }

    }


    /**
     * 双向触发的输入值修改
     * 双向：输入内容 与 搜索选项文本补丁
     */
    class Main {
        
        static start(){
            textPatch = " "
            textPatch += "-site:csdn.net "
            textPatch += "-site:zhihu.com "

            Main.addInputListener(Bing)
            Main.addInputListener(Google)
        }

        /** 
         * 输入内容 触发的输入值修改
         * 
         * @param {Handler} handler 任意网站处理器 
         */
        static addInputListener(handler){
            let element = handler.getInputElement()
            if (element === undefined || element === null) {
                console.log("WARN: 无输入元素");
                return
            }
            element.oninput = (ev) => {
                let e = handler.getInputElement()

                let cursorStart = e.selectionStart  // 光标初始位置
                let v = handler.getSearchValue(e)
                console.debug(`原始 str: ${v}`);

                if (!v.endsWith(textPatch)) {
                    handler.setSearchValue(e, v + textPatch)
                    console.debug(`更新后: ${v + textPatch}`);

                    // 重新定位光标
                    e.selectionStart = cursorStart
                    e.selectionEnd = cursorStart

                    console.debug(`更新光标位置 cursorIndex:[${cursorStart}]`);
                }else{
                    // console.log(e.value)
                }
            }
            
            console.debug("找到搜索框元素，持续监听中...")
        }
    }

    Main.start()

 })();