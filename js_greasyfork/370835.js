// ==UserScript==
// @name          Reddit "Mark All Read"
// @namespace     http://userscripts.org/users/mb34
// @description   Adds a button next to the logo to Mark All Posts Read
// @include       http://reddit.com/*
// @include       http://*.reddit.com/*
// @include       https://www.reddit.com/
// @include       https://www.reddit.com/*
// @include       https://*.reddit.com/*
// @exclude       http://www.reddit.com/comscore-iframe/*
// @exclude       http://static.reddit.com/ads/*
// @version       1.0
// @date          8/2/2018
// @creator       MrBaseball77
// @homepage
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370835/Reddit%20%22Mark%20All%20Read%22.user.js
// @updateURL https://update.greasyfork.org/scripts/370835/Reddit%20%22Mark%20All%20Read%22.meta.js
// ==/UserScript==

(function(){
setTimeout(function(){
    var item;
    var button = [].slice.call(document.querySelectorAll("div.s1f7qvlr-5.hkOTKM")).pop();

    if(typeof button=="undefined"||!button) return;

    //create button with hide all functionality
    var btn = document.createElement('button');
    var textnode = document.createTextNode("Hide All");
    var span = document.createElement('span');
    span.appendChild(textnode);
    span.setAttribute('style', 'color: #0079D3;');
    btn.setAttribute('class','etmkug-14 SuUwW');
    btn.setAttribute('style','margin-left:10px;padding:3px;border:1px solid #0079D3;border-radius:2px;');
    btn.setAttribute('id','reddit-mark-all-read');
    btn.appendChild(span);
    button.insertAdjacentElement("beforeend",btn);

    var element = document.getElementById('reddit-mark-all-read');
    var spinner = {
            lock : 0,
            remove : function(){
                if(spinner.lock ==0) {
                    element.style.background = "#EFF7FF";
                }
            },
            add : function(){
                //created ajax spinner with http://www.ajaxload.info/ #EFF7FF and #FF4500 (orangered)
                //created data uri with http://www.sveinbjorn.org/dataurlmaker
                element.style.background = 'url("data:image/gif;base64,R0lGODlhEAAQAPIAAO/3//9FAPLMwv'+
                'pzQv9FAPiJYvafgvWqkiH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACw'+
                'AAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwA'+
                'AAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkEAAoAAgAsA'+
                'AAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAw'+
                'AsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAA'+
                'sAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAFACwA'+
                'AAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQACgAGACwAA'+
                'AAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAA'+
                'AQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==") '+
                '#EFF7FF no-repeat center';
            }
        }; // spinner definition
    btn.addEventListener('click', function(event) {
        //ajax loading spinner
        var location = window.location.href;
        //grab & "visit" all
        var links = document.querySelectorAll("a[data-click-id='body']");
        var count = 0;
        spinner.add();
        for(var i=0; i<links.length; i++) {
            //add spinner background image
            //**********************************************************************
            // use replaceState to push a new entry into the browser's history, essentially
            // telling the browser that you visited the link, marking it as read!!
            //**********************************************************************
            history.replaceState({},"",links[i]);
            ++count;
        } // for
        //******************************************
        // Do I need to remove the background here??
        //******************************************
        spinner.remove();
        window.location = location;
        if(count===0){
            alert('None Found.');
        }
        event.stopPropagation();
        event.preventDefault();
    });
    },1000);
})();