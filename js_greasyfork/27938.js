// ==UserScript==
// @name         block-silly-B
// @namespace    bakaCirno
// @version      0.1
// @description  block someone I don't like
// @author       cirno
// @match        http://stackoverflow.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27938/block-silly-B.user.js
// @updateURL https://update.greasyfork.org/scripts/27938/block-silly-B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var users = document.querySelectorAll("div.user-info.user-hover");
    users.forEach(function(node){
        var links = node.querySelectorAll('a');
        links.forEach(function(node){
            if(node.href.match(/\/users\/895245/g)){
                if(node.text !== ''){
                    node.text = 'Ciro Santilli';
                }else{
                    node.firstChild.firstChild.src = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSgBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIACAAIAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APp/UdRstNh87Uby2tIum+eVY1/MmplOMFeTsbUMNWxEuWjByfZJv8hmm6vpuqKzaZqFneBfvG3mWTH12k0oVIT+F3KxGExGG0r03H1TX5lGbxb4chleKbxBpEcqMVdHvYwVI4II3cGoeIpJ2cl96OiOUY+cVKNCbT/uy/yNSxvbW/txPY3MFzAekkMgdT+I4rSMlJXi7nJWoVKEuSrFxfZqz/E+efFMdhJ8Z7tPiGbgaQwItiWYR7cDZyvIXrnHfr3rxKyi8U/rG3Q/UculWjkMXk9vafa2vfrv17X6bHsPgvwn4Z0WWTUvCyKsV1EELRXDTRuAc5BJP6GvUoYelT9+l1PhM1zfMMYlh8e9Yu+qSa+5L8jwnQP+EO/4TbxT/wAJ1/qPtUv2f/Xfe8xs/wCr9sda8an7D2s/b9/Pv5H6Rjf7V+oYb+yt+VX+HblVvi/Q7P4DaYy+Jdd1LSGkTw25aKBJXBZzuypK9RgZ5Pr9a68uh+8lOHwngcY4pPC0MPiEnXWrstFprr5vsdF4j8deBb+4v9G8WxqslpM0RWe2aQHH8SMgJX9DW9XFYeTdOr08jysDkWc0IwxeXvSST0kl8mm1f8Ucj8DHb/hPdbTw8bo+FtrEednAORs/4F198da5sv8A40vZ/Ae5xel/Z1F4y31jTb8fl+F9jG8Gan4V03x14tbxlHaPC9zIIPtNobgbvNbOAFbHGKxoTowrT9t37X6noZrhcyxGX4VZa2moq9pcv2Vbqrmr8Lnt774x6heeE7eWDw95b+YApVMFeOO2X5A9K1wlpYpypL3Ti4hU6OR06WYSTrXVur37+mjZ7bqOgaPqcol1LSdPu5B/HcWySH8yDXrSpQnrKKfyPzyhmGKw65aNWUV5Sa/Jly0tbezgWG0gighXpHEgVR9AKuMVFWSMKlWdWXPUk2+7dzKm8JeHJpXlm8P6RJK7Fnd7KMlieSSdvJrJ4ek3dxX3I7I5vj4RUY15pL+9L/M07GytbC3EFhbQW0C9I4Ywij8BxWkYqKtFWOStXqV5c9WTk+7d3+J//9k=';
                }
            }
        });
    });

    var comments = document.querySelectorAll('a.comment-user');
    comments.forEach(function(node){
        if(node.href.match(/\/users\/895245/g)){
            node.text = 'Ciro Santilli';
        }
    });

})();