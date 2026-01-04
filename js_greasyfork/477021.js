// ==UserScript==
// @name         bugzilla自动填充
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  手动写太难搞，自动填一点模板吧!
// @author       You
// @match        https://*/bugzilla/show_bug.cgi?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477021/bugzilla%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/477021/bugzilla%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==



(function () {
    'use strict';
    function sleep1(ms, callback) {
        setTimeout(callback, ms)
    }
    //sleep 1s
    sleep1(1000, () => {
        console.log(1000)
    })


    sleep1(1000, function () {
        var bug_status = document.querySelector("#bug_status");
        var resolution =document.querySelector("#resolution");
        console.log("11111111");
        if (bug_status) {

            function ChangeSelect(e) {

                var str=document.querySelector("#bug_status").value+document.querySelector("#resolution").value;


                console.log(str);

                const map1 = new Map();

                map1["UNCONFIRMED"] = "6";
                map1["NEW"] = "XX   描述不明确\r\n未能复现证明看到了bug";
                map1["ASSIGNED"] = "【产生原因】：此问题由于开发时，考虑不全面导致，增加对此情景处理";
                map1["REOPENED"] = "测试人员在处理RESO FIXE时，在指定的版本及以后的版本中进行验证，如果发现该Bug仍存在，将Bug置为REOP状态，并在comments中注明重现该Bug的版本，补充必要的信息，需要研发人员继续查找原因，进一步修复Bug；\n\n测试人员在测试过程中，发现状态为VERI FIXE的Bug重现了，将Bug置为REOP状态，并在comments中注明重现该Bug的版本，补充必要的信息，需要研发人员继续查找原因，进一步修复Bug；\n\n测试人员在测试过程中，发现状态为CLOS的Bug重现了，操作同上\n\n";
                map1["VERIFIED"] = "6";

                map1["RESOLVEDFIXED"] = "【产生原因】：此问题由于开发时，考虑不全面导致，增加对此情景处理\n\n【解决方法】：开启访问控制开关，检测本机xx， 将本机xx自动加入放行列表\n\n【影响模块】：[管理/管理/xx控制]-xxxx控制\n\n【测试建议】：xxxxxxx版本验证\n\n"
                map1["RESOLVEDINVALID"] = "【无效说明】：（必填）\n\n"
                map1["RESOLVEDLATER"] = "1【延后说明】：由于扫描任务下发后，客户端不进行任务id 和 结果日志绑定，所以日志中不能查到具体任务id，此功能由于客户端合作关系，暂不具备修复条件\n\n【预期修改】：NGEDR上设计修改\n\n"
                map1["RESOLVEDDUPLICATE"] = "【重复bug号】：（必填）\n\n研发人员接收分配给自己的Bug后，如当前项目的Bug List中查看该Bug与之前的Bug重复，将新Bug置为RESO DUPL状态，of  中填写重复bug号\n\n（部分研发人员将旧Bug置为RESO DUPL是错误的）"
                map1["RESOLVEDWONTFIX"] = "【不修复说明】：智能计算模块属于项目测评临时增加模块，此项目测评已经结束，后续此模块不会在产品中使用，不进行修复。\n\n\n"
                map1["RESOLVEDWORKSFORME"] = "1"

                map1["VERIFIEDFIXED"] = "测试人员在处理RESO FIXE时，在指定的版本及以后的版本中进行验证，如果发现该Bug已经不存在，将Bug置为VERI FIXE状态，并在comments中注明验证通过的版本"
                map1["VERIFIEDINVALID"] = "1"
                map1["VERIFIEDLATER"] = "1"
                map1["VERIFIEDDUPLICATE"] = "1"
                map1["VERIFIEDWONTFIX"] = "1"
                map1["VERIFIEDWORKSFORME"] = "1"




                var edit = document.querySelector("#comment");
                if (edit) {
                    edit.value = map1[str];
                    return;
                    //break;
                }
            }
            bug_status.addEventListener('change',ChangeSelect);
            resolution.addEventListener('change',ChangeSelect);
            // selectVar.onselect = function () {



            // }
        }

    })


    // Your code here...
})();