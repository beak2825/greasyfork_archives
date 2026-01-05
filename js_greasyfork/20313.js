// ==UserScript==
// @name         METU Name From Number
// @namespace    https://openuserjs.org/scripts/onlined/METU_Name_From_Number
// @version      0.1.2
// @description  Shows corresponding names next to student numbers.
// @author       onlined
// @match        http://*.metu.edu.tr/*
// @match        https://*.metu.edu.tr/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/20313/METU%20Name%20From%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/20313/METU%20Name%20From%20Number.meta.js
// ==/UserScript==

(function() {
            
    var nameFromNumber = function(node) {
        var matches = node.nodeValue.match(/e?([0-9]{6,7})/g);
        
        if(!matches)
            return;
        
        var nums = [];
        
        for(var i=0;i<matches.length;i++) {
            var num = matches[i];
            if(num.charAt(0) == 'e')
                num = num.substr(1);
            if(num.length == 6) {
                var count = 0;
                for(var j=0;j<6;j++) {
                    if(j%2) {
                        var tmp = (parseInt(num.charAt(i))*2).toString();
                        count += parseInt(tmp.charAt(0));
                        if(tmp.length == 2)
                            count += parseInt(tmp.charAt(1));
                    }
                    else {
                        count += parseInt(num.charAt(i));    
                    }
                }
                num = num + ((100-count)%10).toString();

            }
            nums.push(num);
        }
        
        var serialize = function(obj) {
            var str = [];
            for(var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        };
              
        var findName = function (a) {
            var response = GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://oibs2.metu.edu.tr/~oibs/Epe_Results/main.php',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: serialize({
                    'text_student': nums[a],
                    'submit_result': 'Get Results',
                    'hidden_redir': 'Login'
                }),
                onload: function(response) {
                    var dom = document.createElement('div');
                    dom.innerHTML = response.responseText;
                    var name = dom.getElementsByTagName('form')[0].children[0].children[0].innerText.split(' ').slice(2).join(' ').trim();
                    if(name != "Student/Application number :") {
                        var tmp = document.createElement('div');
                        tmp.innerHTML = node.nodeValue.replace(
                                new RegExp(matches[a],'g'),
                                '<span title="' + name + '">' + matches[a] + '</span>'
                            );
                        while (tmp.firstChild)
                            node.parentNode.insertBefore(tmp.firstChild,node);
                        node.parentNode.removeChild(node);
                    }
                }
            });
        };
        
        for(i=0;i<matches.length;i++) 
            findName(i);
    };

    var elements = document.body.getElementsByTagName("*");

    for(var i=0;i<elements.length;i++) {
        var nodes = elements[i].childNodes;
        for(var j=0;j<nodes.length;j++)
            if(nodes[j].nodeType == Node.TEXT_NODE)
                nameFromNumber(nodes[j]);
    }
    
})();
