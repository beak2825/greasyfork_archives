// ==UserScript==
// @name            nicoseiga res checker
// @namespace       nicoseigareschecker
// @description     ニコニコ静画のコメント欄を色付けすることでレス先をわかりやすくします
// @author          sotoba
// @match           http://seiga.nicovideo.jp/seiga/im*
// @version         1.1.2.20181103
// @license         MIT License
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/372032/nicoseiga%20res%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/372032/nicoseiga%20res%20checker.meta.js
// ==/UserScript==
//---------------------------------------------------------------------------------------

(function () {
    'use strict';

    const resType = {
        // type:"↑"
        arrow: Symbol("arrow"),
        // type:">" and　"＞"
        anchor: Symbol("anchor")
    }

    class commentList {
        constructor(list) {
            this.commentListElement = list;
        }

        setCommentList(list) {
            this.commentListElement = list;
        }

        getCommentList() {
            return this.commentListElement
        }

        /**
         *
         * レスを含むコメントにマーキングする
         * @returns :boolean
         * 　マーキングしたか否か
         */
        chengeCommentList() {
           // let refList = []
            let result=false

            //1番目のコメントのID
            const firstElementID = this.commentListElement.children[0].getElementsByClassName("id")[0].children[0].innerHTML
            let i = 0
            for (const elem of this.commentListElement.children) {
                const commentString = elem.getElementsByClassName("text")[0].innerHTML
                //レス情報を現すオブジェクトを取得
                const resDataObject = this.checkResponse(commentString)
                if (resDataObject.isResonse) {
                    //オブジェクトに残りの情報を格納
                    //resDataObject.element = elem
                    //resDataObject.id = elem.getElementsByClassName("id")[0].children[0].innerHTML
                    //今表示しているコメント一覧より前を参照しているか？
                    if (resDataObject.type == resType.arrow && i - Number(resDataObject.target) < 0) {
                        resDataObject.refHistory = true
                    } else if (resDataObject.type == resType.anchor && Number(resDataObject.target) < Number(firstElementID)) {
                        resDataObject.refHistory = true
                    } else {
                        resDataObject.refHistory = false
                    }

                    //refList.push(resDataObject)
                    result=true
                    const resString = commentString.substring(0, resDataObject.stringLen)
                    const restString = commentString.substring(resDataObject.stringLen)
                    const typeString = resDataObject.type === resType.arrow ? "arrow" : "anchor"
                    const refHistoryString = resDataObject.refHistory ? "true" : "false"
                    /**
                     * レス文字列に属性を付ける
                     * type:レスのタイプ
                     * target:レス先（矢印なら何個前か、アンカーならID）
                     * refHistory:省略している過去ログを参照しているか否か(boolean)
                     */
                    elem.getElementsByClassName("text")[0].innerHTML = "<span class=res-check type=" + typeString + " target=" + resDataObject.target + " refHistory=" + refHistoryString + ">" + resString + "</span>" + restString
                }
                i++;
            }
            //return refList.length > 0
            return result
        }

        /**
         * コメント文字列がレス文字列を含んでいるかを確認
         * @param str
         * コメント文字列
         * @returns {
         *    isResponse,レス文字列を含むか
         *    type,レスの形式
         *    target,レス先を現す数字
         *    length,レス表現の文字列長
         * }||null
         *
         */
        checkResponse(str) {
            if (str.startsWith("↑")) {
                // pattern:↑↑↑
                const regResult = str.match(/^(↑+)([ 　×x]*)([0-9０-９]*).*/)
                if (regResult[1].length > 0 && regResult[3].length > 0) {
                    // pattern :↑5,↑３
                    const target = regResult[3].replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
                    const result = {
                        isResonse: true,
                        type: resType.arrow,
                        target: target,
                        stringLen: regResult[1].length + regResult[2].length + regResult[3].length
                    }
                    return result
                } else if (regResult[1].length > 0) {
                    const result = {
                        isResonse: true,
                        type: resType.arrow,
                        target: regResult[1].length,
                        stringLen: regResult[1].length
                    }
                    return result
                }
            } else if (str.startsWith("&gt;") || str.startsWith("＞")) {
                // pattern: >12345,>> 12345、＞１２３４５...
                const regResult = str.match(/^(&gt;)+([ 　]*)([0-9０-９]*).*/)
                const regResult2 = str.match(/^(＞)+([ 　]*)([0-9０-９]*).*/)
                if (regResult !==null && regResult[1].length > 0) {
                    const target = regResult[3].replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
                    const result = {
                        isResonse: true,
                        type: resType.anchor,
                        target: target,
                        stringLen: regResult[1].length + regResult[2].length + regResult[3].length
                    }
                    return result
                } else if (regResult2 !==null &&regResult2[1].length > 0) {
                    const target = regResult2[3].replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
                    const result = {
                        isResonse: true,
                        type: resType.anchor,
                        target: target,
                        stringLen: regResult2[1].length + regResult2[2].length + regResult2[3].length
                    }
                    return result
                }
            }
            return {isResonse: false}
        }

        isReferHistory(refList) {
            for (const ref of refList) {
                if (ref.refHistory) {
                    return true;
                }
            }
            return false;
        }
    }


    class Utils {
        getCommentListObject(commentListElement) {
            return new commentList(commentListElement)
        }

        /**
         * マークのあるコメントを色付けする
         */
        colorizeCommentList() {
            const resList = document.getElementsByClassName("res-check")
            const colorList = ["#F5B090", "#FCD7A1", "#FFF9B1", "#D7E7AF", "#A5D4AD", "#A2D7D4", "#9FD9F6", "#A3BCE2", "#A59ACA", "#CFA7CD", "#F4B4D0", "#F5B2B2"]
            const colorListSize = colorList.length

            let i = 0
            for (const res of resList) {
                const color = colorList[i % colorListSize]
                //レス文字列を色付け
                res.setAttribute("style", "background-color:" + color + ";font-size:bold;");
                //レスの指し先を色付け
                if (res.getAttribute("refHistory") === "false") {
                    const targetNumber = Number(res.getAttribute("target"))
                    const commentItemElement = res.parentNode.parentNode.parentNode;
                    if (res.getAttribute("type") === "arrow") {
                        // N個前のコメントを取得
                        let previousComment = commentItemElement.previousElementSibling
                        for (let i = 0; i < targetNumber - 1; i++) {
                            previousComment = previousComment.previousElementSibling
                        }
                        previousComment.getElementsByClassName("text")[0].setAttribute('style', `background-color:${color};`)
                    } else if (res.getAttribute('type') === 'anchor') {
                        const commentListElement=commentItemElement.parentNode
                        const target =res.getAttribute("target")
                        for (let commetElement of commentListElement) {
                            const id = commetElement.getElementsByClassName('id')[0].firstChild[0].innerText
                            if (target === id) {
                                const commentText = commetElement.getElementsByClassName("text")[0]
                                commentText.setAttribute('style', `background-color:${color};`)
                            }
                        }
                    }
                }
                i++
            }
        }
    }

    window.onload = () => {
        const utils = new Utils();
        const shortCommentListElement = document.getElementById('ko_comment').querySelector('#comment_list')//.getElementById("comment_list")
        const allCommentListElement = document.getElementById("ko_comment_all").querySelector('#comment_list')//.getElementById("comment_list")
        const commentList = utils.getCommentListObject(shortCommentListElement);
        if (commentList.chengeCommentList()) {
            utils.colorizeCommentList();
        }

        const mo = new MutationObserver(function (MutationRecords, MutationObserver) {
            //「すべて読む」をクリックした場合
            const commentList = utils.getCommentListObject(allCommentListElement);
            if (commentList.chengeCommentList()) {
                utils.colorizeCommentList();
            }
        });
        mo.observe(allCommentListElement, {
            childList: true,
            subtree: true,
        });

    }
})();
