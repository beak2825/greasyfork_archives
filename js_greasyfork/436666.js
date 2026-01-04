// ==UserScript==
// @name         itest
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  刷itest自助学习的填空和选择题。
// @author       xiaoyan
// @match       *.unipus.cn/itest/itest/s/jcxl/jcxl*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      可以修改刷题速度speed，单位是ms
// @downloadURL https://update.greasyfork.org/scripts/436666/itest.user.js
// @updateURL https://update.greasyfork.org/scripts/436666/itest.meta.js
// ==/UserScript==

(function() {
    var dein;
    var num = 0,
        temjishu = 0,
        initalnum = 0;
    var speed = 0;
    speed = 500;


    var flag = true;
    var url = window.location.href;
    var sub3 = url.substring(url.length-3);
    let targetNode = document.querySelector('#quesAnswerArea');

    function callback(mutationList, observer) {
        mutationList.forEach((mutation) => {
            switch (mutation.type) {
                case 'childList':
                    mutation.addedNodes.forEach((node) => {
                            if (node.className == 'qs_ques_rate_block') {
                                document.getElementById('nextBtn').click();
                            }
                        })
                        /* 从树上添加或移除一个或更多的子节点；参考mutation.addedNodes 和mutation.removeNodes */
                    break;
                case 'attributes':
                    /* mutation.target 中某个节点的一个属性值被更改；该属性名称在mutation.attributeName中，该属性之前的值为 mutation.oldValue */
                    break;
            }
        });
    }

    let observerOptions = {
        childList: true, // 观察目标子节点的变化，添加或删除
        attributes: true, // 观察属性变动
        subtree: true //默认是false设置为true后可观察后代节点
    }

    let observer = new MutationObserver(callback);

    observer.observe(targetNode, observerOptions);

    function addbutton() {
        //1创建一个按钮节点
        var oButNode = document.createElement("mydiv");
        oButNode.innerHTML =
            '<div class="mydiv" style=" width: 400px; position: fixed; top: 8px; left: 8px; z-index: 99999; background-color: #eee; overflow-x: auto;">' +
            '<table border="1">' +
            '<tr>' +
            '<td>请输入要刷的题目数量</td>' +
            '<td><input id="donum" type="text"></input></td>' +
            '</tr>' +
            '<tr>' +
            '<td>停止按钮</td>' +
            '<td><input type="button" id="stop" value="stop" style="background-color:orange;"></input></td>' +
            '</tr>' +
            '<tr>' +
            '<td>开始按钮</td>' +
            '<td><input type="button" id="star" value="star" style="background-color:orange;"></input></td>' +
            '</tr>' +
            '</table>'
        '</div>'
        //获取div节点
        var oDivNode = document.getElementById("wrap");
        //将按钮添加进节点
        oDivNode.appendChild(oButNode);
    }
    addbutton();


    function over() {

        var total = 0;
        total = Number(document.getElementById('doneQues').innerText);
        total = total-initalnum;
        console.log(total);
        console.log(initalnum);
        console.log(num);
        if (total > num) {
            clearInterval(dein);
        }
    }

    document.getElementById("stop").addEventListener("click", function() {
        clearInterval(dein);
    });

    document.getElementById("star").addEventListener("click",
        function() {

            if (sub3 == "250" || sub3 == "258" || sub3 == "253" || sub3 == "257" || sub3 == "256" || sub3 == "197" || sub3 == "260") {
                let words = ['doucument', 'element', 'shabi', 'haha', 'memory', 'application', 'security', 'performance', 'security', 'console', 'new', 'desprate', 'select', 'errors', 'verbosse', 'preserve', 'log', 'group', 'similar', 'messages', 'eager', 'evaluation', 'log', 'preserve']
                temjishu = 0;
                initalnum = Number(document.getElementById('doneQues').innerText);
        num = Number(document.getElementById('donum').value);
                dein = setInterval(function() {
                    temjishu++;
                    document.getElementsByTagName('input')[0].value = words[(Math.ceil(Math.random() * 100)) % 23];
                    document.getElementById('checkBtn').click();
                    if (temjishu % 100 == 0) {
                        over();
                    }

                }, speed);
            } else if (sub3 == "196" || sub3 == "180" || sub3 == "255") {
                temjishu = 0;
                initalnum = Number(document.getElementById('doneQues').innerText);
        num = Number(document.getElementById('donum').value);
                dein = setInterval(function() {
                    temjishu++;
                    document.getElementsByTagName('input')[(Math.ceil(Math.random() * 10)) % 3].click();
                    document.getElementById('checkBtn').click();
                    if (temjishu % 100 == 0) {
                        over();
                    }
                }, speed)
            } else if (url.search("ctb")) {
                var i = 0;
                var j = 0;
                var pan = "1";
                dein = setInterval(function() {
                    i++;
                    document.getElementById('removeFromWrongBtn').click();
                    if (i == 40) {
                        if (document.querySelector('.qs_ques_qid').innerText == pan) {
                            setTimeout(function() {
                                document.getElementById('nextBtn').click();
                            }, 140);
                            j++;
                            if (j > 3)(clearInterval(dein));
                        } else {
                            j = 0;
                        }
                        i = 0;
                        pan = document.querySelector('.qs_ques_qid').innerText;

                        var str = document.getElementById('currentPage').innerText;
                        var ind = str.indexOf('/');
                        if (str.substring(0, ind) == str.substring(ind + 1)) {
                            flag = false;
                        }

                    }
                }, 150);
            }
        }
    );
})()