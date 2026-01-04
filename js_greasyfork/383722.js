// ==UserScript==
// @name         Thanos script
// @name:zh-CN   灭霸脚本
// @version      0.2.1
// @description  random remove half elements when triple click page
// @description:zh-CN 鼠标三击页面的时候，随机移除页面上的一半元素
// @author       tabedit
// @include     *
// @grant        none
// @namespace https://greasyfork.org/users/225710
// @downloadURL https://update.greasyfork.org/scripts/383722/Thanos%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/383722/Thanos%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fingerSnap(){
        'use strict'
        var nodeIter = document.createNodeIterator(
            document.body,NodeFilter.SHOW_TEXT + NodeFilter.SHOW_ELEMENT +
            NodeFilter.SHOW_COMMENT ,null);
        var leafNode = [];
        var nn;
        while (true){
            nn = nodeIter.nextNode();
            if(nn === null){
                break;
            }
            if (nn.childNodes.length === 0){
                leafNode.push(nn);
            }
        }
        for(var ind = 0; ind < leafNode.length; ind++){
            if (Math.random() < 0.5){
                removeLeafNode(leafNode[ind]);
            }
        }
    }

    function removeLeafNode(aNode){
        var timeDurition = 2;
        try {
            if (aNode.nodeType === 1){
                aNode.style.transition='transform ' + timeDurition + 's' + ',opacity ' + timeDurition + 's';
                aNode.style.transform = 'rotate(180deg) scale(0, 0)';
                aNode.style.opacity = '0.3';
            } else if(aNode.nodeType === 3){
                var aNodeParent = aNode.parentNode;
                aNodeParent.style.transition='color ' + timeDurition + 's';
                var aNodeCompStyle = document.defaultView.getComputedStyle(aNodeParent);
                aNodeParent.style.color = aNodeCompStyle.color.replace('rgb','rgba').replace(')',',0)')
            }

            setTimeout(function(){
                aNode.parentNode.removeChild(aNode);
            },timeDurition * 1000);
        }
        catch(e){
            debugger;
        }
    }


    var threeClick = function (){
        'use strict'
        var timeSeq = [1, 100000, 200000];
        var MININTERVAL = 400;
        return function(){
            var now = new Date();
            console.log(now.getTime());
            timeSeq.push(now.getTime());
            timeSeq.shift();
            if(timeSeq[1] - timeSeq[0] < MININTERVAL &&
               timeSeq[2] - timeSeq[1] < MININTERVAL){
                fingerSnap()
            }
        }
    }();

    document.addEventListener('click',threeClick);
})();