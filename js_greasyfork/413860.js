// ==UserScript==
// @name         Geekhub
// @namespace    https://geekhub.com
// @version      1.1.1
// @description  geekhub增强插件
// @author       Leetao
// @match      https://www.geekhub.com/*
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/413860/Geekhub.user.js
// @updateURL https://update.greasyfork.org/scripts/413860/Geekhub.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建评论的markdown在线预览
    var initComment = function() {
        var divNode = document.createElement('div');
        divNode.setAttribute('id','markdown-preview');
        var comment = document.getElementById("comment-box");
        if(comment != null) {
            comment.parentElement.appendChild(divNode);
        };
        var el = document.getElementById('comment-box');
        if(el != null){
            el.addEventListener('input',function () {
                var value = document.getElementById('comment-box').value;
                console.log(value);
                if(value != null) {
                    document.getElementById('markdown-preview').innerHTML = marked(value);
                }
            });
        }
    }

    // 创建话题 markdown
    var initPost = function() {
        var postDivNode = document.createElement('div');
        postDivNode.setAttribute('id','markdown-preview');
        var post = document.getElementById("post_content");
        if(post != null) {
            post.parentElement.appendChild(postDivNode);
        };
        var e2 = document.getElementById('post_content');
        if(e2 != null){
            e2.addEventListener('input',function () {
                var value = document.getElementById('post_content').value;
                if(value != null) {
                    document.getElementById('markdown-preview').innerHTML = marked(value);
                }
            });
        }
    }

    var initSencondHand = function() {
        var postDivNode = document.createElement('div');
        postDivNode.setAttribute('id','markdown-preview');
        var post = document.getElementById("second_hand_content");
        if(post != null) {
            post.parentElement.appendChild(postDivNode);
        };
        var e2 = document.getElementById('second_hand_content');
        if(e2 != null){
            e2.addEventListener('input',function () {
                var value = document.getElementById('second_hand_content').value;
                if(value != null) {
                    document.getElementById('markdown-preview').innerHTML = marked(value);
                }
            });
        }
    }



    var initMolecule = function() {
        var postDivNode = document.createElement('div');
        postDivNode.setAttribute('id','markdown-preview');
        var post = document.getElementById("molecule_content");
        if(post != null) {
            post.parentElement.appendChild(postDivNode);
        };
        var e2 = document.getElementById('molecule_content');
        if(e2 != null){
            e2.addEventListener('input',function () {
                var value = document.getElementById('molecule_content').value;
                if(value != null) {
                    document.getElementById('markdown-preview').innerHTML = marked(value);
                }
            });
        }
    }

    // service_content


    var initGroupBuy = function() {
        var postDivNode = document.createElement('div');
        postDivNode.setAttribute('id','markdown-preview');
        var post = document.getElementById("group_buy_content");
        if(post != null) {
            post.parentElement.appendChild(postDivNode);
        };
        var e2 = document.getElementById('group_buy_content');
        if(e2 != null){
            e2.addEventListener('input',function () {
                var value = document.getElementById('group_buy_content').value;
                if(value != null) {
                    document.getElementById('markdown-preview').innerHTML = marked(value);
                }
            });
        }
    }

    var initService = function() {
        var postDivNode = document.createElement('div');
        postDivNode.setAttribute('id','markdown-preview');
        var post = document.getElementById("service_content");
        if(post != null) {
            post.parentElement.appendChild(postDivNode);
        };
        var e2 = document.getElementById('service_content');
        if(e2 != null){
            e2.addEventListener('input',function () {
                var value = document.getElementById('service_content').value;
                if(value != null) {
                    document.getElementById('markdown-preview').innerHTML = marked(value);
                }
            });
        }
    }


    var pasteUpload = function(fileList) {
        for(var j = 0; j < fileList.length; j++) {
            var formData = new FormData();
            formData.append('smfile', fileList[j]);
            var response = GM_xmlhttpRequest({
                method: "post",
                url: 'https://sm.ms/api/v2/upload',
                data: formData,
                onload: function(r) {
                    var json = JSON.parse(r.responseText);
                    if (json.success == true){
                        var url = json.data.url;
                        var name = json.data.storename;
                        if(document.getElementById('comment-box') != null) {
                            document.getElementById('comment-box').value += "![alt "+ name +"](" + url + ")";
                        }
                        if(document.getElementById("post_content") != null) {
                            document.getElementById('post_content').value += "![alt "+ name +"](" + url + ")";
                        }
                    } else {
                        alert("上传失败");
                    }
                }
            });
        }

    }

    var initMarkdown = function() {
        initComment();
        initService();
        initGroupBuy();
        initMolecule();
        initSencondHand();
        initPost();

        document.addEventListener('paste', function (event) {
            var items = event.clipboardData && event.clipboardData.items;
            var fileList = [];
            var urlList = [];
            if (items && items.length) {
                // 检索剪切板items
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        fileList.push(items[i].getAsFile());
                    }
                }
            }
            // 此时fileList就是剪切板中的图片文件列表
            if(fileList.length !== 0) { // 不为0，则上传到 sm.ms
                pasteUpload(fileList);
            }
        });
    }





    var observer = new MutationObserver(function(doc, observer) {
        if(document.getElementById('markdown-preview') === null) {
            initMarkdown();
        }
    });

    observer.observe(document, {
        characterData: true,
        childList: true,
        attributes: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });
})();