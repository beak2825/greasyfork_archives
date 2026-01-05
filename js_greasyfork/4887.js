// ==UserScript==
// @name        Le Upboat! xD
// @version     0.0.2.4
// @namespace   leupboat
// @description Vote on posts on /g/.
// @license     CC0; https://creativecommons.org/publicdomain/zero/1.0/.
// @grant       GM_xmlhttpRequest
// @include     *://boards.4chan.org/g/*
// @include     *://boards.4chan.org/s4s/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/4887/Le%20Upboat%21%20xD.user.js
// @updateURL https://update.greasyfork.org/scripts/4887/Le%20Upboat%21%20xD.meta.js
// ==/UserScript==
(function() {
    var debug = false;

    var imageData = {
        downOff: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAD72lDQ1BJQ0NQcm9maWxlAAB4nI1V3W/bVBQ/iW9cpBY/oLGODhWLr1VTW7kbGq3GBkmTpelCGrnN2CqkyXVuGlPXNrbTbVWf9gJvDPgDgLIHHpB4QhoMxPay7QG0SVNBFdUkpD102kBok/aCqnCur1O7Xca4ka9/Oed3Pu/RNUDHV5rjmEkZYN7yXTWfkY+fmJY7ViEJz0En9ECnpntOulwuAi7GhUfWw18hwd43B9rr/3N1VqmnAySeQmxXPX0e8WmAlKk7rg8g3kb58CnfQdzxPOIdLiaIWGF4luMswzMcHw84U+ooYpaLpNe1KuIlxP0zMflsDPMcgrUjTy3qGrrMelF27Zph0li6T1D/zzVvNlrxevHp8uYmj+K7j9Ved8fUEH+ua7lJxC8jvub4GSZ/FfG9xlwljXgvQPKZmnukwvnJNxbrU+8g3om4aviFqVC+aM2UJrhtcnnOPqqGnGu6N4o9gxcR36rTQpHnI0CVZnOsX4h7642x0L8w7i1M5lp+FuujJe5HcN/TxsuIexB/6NrqBM9ZWKZmXuX+hSuOXw5zENYts1TkPolEvaDGQO7Xp8a4LTng4yFyWzJdM44UQv6SYwaziLmR825DrYScG5qby3M/5D61KqHP1K6qlmW9HUR8GI4lNKBgwwzuOliwATKokIcMvh1wUVMDA0yUUNRSlBiJp2EOZe155YDDccSYDazXmTVGac/hEe6EHJt0E4Xsx+cgKZJDZJiMgEzeJG+RwySL0hFycNO2HIvPYt3Z9PM+NNAr4x2DzLmeRl8U76x70tCvf/T3Fmv7kZxpK594B8DDDrSYA/H6ry79sCvysUIuvHuz6+oSTDypv6nbqfXUCu6rqbWIkfo9tYa/VUhjbmaQ0Tw+RpCHF8sgXsNlfHzQcP8DeXaMtyVizTrXE2lYJ+gHpYclONsfSZXflD+VFeUL5bxyd1uX23ZJ+FT4VvhR+E74XvgZZOGScFn4SbgifCNcjJ3V4+dj8+yDelvVMk27XlMwpYy0W3pJykovSK9Ixcif1C0NSWPSHtTs3jy3eLx4LQacwL3V1faxOK+CWgNOBRV4QYctOLNt/kNr0kuGSGHb1A6zWW4xxJyYFdMgi3vFEXFIHGe4lZ+4B3UjuOe2TJ3+mApojBWvcyCYOjarzHoh0HlAfXraZxftqO2ccY3Zui/vU5TX5TR+qqhcsPTBflkzTTlQebJLPeou0OogsO8gv6IfqMH3LbHzeiTz3wY49BfeWTci2XQD4GsPoPu1SNaHd+KznwFcOKA33IXwzk8kfgHwavv38X9dGbybbjWbD/C+6vgEYOPjZvOf5WZz40v0vwZwyfwXWQBxeO6COJEAAAoeaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjEuMiI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+MTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4yPC90aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5Gy9TIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIXRFWHRTb2Z0d2FyZQBHcmFwaGljQ29udmVydGVyIChJbnRlbCl3h/oZAAAAy0lEQVR4nKSTQQ6EIAxFvf9FxI2SACuMC1nBxgXep5PfpEaZwUBm8UNq29dfiAMRDf+omjjPk3LOlxB3AdCUUmLFGBnSBTiOg/Z9Z4UQCHEXAFO996x1XdlJFwBTnXMsay276AJs20bLstA8zyzEVYBSirTW3HAXvkPTNHEsNXIid5GkSJrGcXycd0nd1wriBE2iEoY8hlXvAIW4tNIJZIx5NFcvEUV3iDSL7aZXAAR2y52bAbIOnrC03QwQyFu+69f9pQ8AAAD//wMAZnAG0L66mp8AAAAASUVORK5CYII=',
        downOn: 'data:image/png;base64,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',
        upOff: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAEJGlDQ1BJQ0MgUHJvZmlsZQAAOBGFVd9v21QUPolvUqQWPyBYR4eKxa9VU1u5GxqtxgZJk6XtShal6dgqJOQ6N4mpGwfb6baqT3uBNwb8AUDZAw9IPCENBmJ72fbAtElThyqqSUh76MQPISbtBVXhu3ZiJ1PEXPX6yznfOec7517bRD1fabWaGVWIlquunc8klZOnFpSeTYrSs9RLA9Sr6U4tkcvNEi7BFffO6+EdigjL7ZHu/k72I796i9zRiSJPwG4VHX0Z+AxRzNRrtksUvwf7+Gm3BtzzHPDTNgQCqwKXfZwSeNHHJz1OIT8JjtAq6xWtCLwGPLzYZi+3YV8DGMiT4VVuG7oiZpGzrZJhcs/hL49xtzH/Dy6bdfTsXYNY+5yluWO4D4neK/ZUvok/17X0HPBLsF+vuUlhfwX4j/rSfAJ4H1H0qZJ9dN7nR19frRTeBt4Fe9FwpwtN+2p1MXscGLHR9SXrmMgjONd1ZxKzpBeA71b4tNhj6JGoyFNp4GHgwUp9qplfmnFW5oTdy7NamcwCI49kv6fN5IAHgD+0rbyoBc3SOjczohbyS1drbq6pQdqumllRC/0ymTtej8gpbbuVwpQfyw66dqEZyxZKxtHpJn+tZnpnEdrYBbueF9qQn93S7HQGGHnYP7w6L+YGHNtd1FJitqPAR+hERCNOFi1i1alKO6RQnjKUxL1GNjwlMsiEhcPLYTEiT9ISbN15OY/jx4SMshe9LaJRpTvHr3C/ybFYP1PZAfwfYrPsMBtnE6SwN9ib7AhLwTrBDgUKcm06FSrTfSj187xPdVQWOk5Q8vxAfSiIUc7Z7xr6zY/+hpqwSyv0I0/QMTRb7RMgBxNodTfSPqdraz/sDjzKBrv4zu2+a2t0/HHzjd2Lbcc2sG7GtsL42K+xLfxtUgI7YHqKlqHK8HbCCXgjHT1cAdMlDetv4FnQ2lLasaOl6vmB0CMmwT/IPszSueHQqv6i/qluqF+oF9TfO2qEGTumJH0qfSv9KH0nfS/9TIp0Wboi/SRdlb6RLgU5u++9nyXYe69fYRPdil1o1WufNSdTTsp75BfllPy8/LI8G7AUuV8ek6fkvfDsCfbNDP0dvRh0CrNqTbV7LfEEGDQPJQadBtfGVMWEq3QWWdufk6ZSNsjG2PQjp3ZcnOWWing6noonSInvi0/Ex+IzAreevPhe+CawpgP1/pMTMDo64G0sTCXIM+KdOnFWRfQKdJvQzV1+Bt8OokmrdtY2yhVX2a+qrykJfMq4Ml3VR4cVzTQVz+UoNne4vcKLoyS+gyKO6EHe+75Fdt0Mbe5bRIf/wjvrVmhbqBN97RD1vxrahvBOfOYzoosH9bq94uejSOQGkVM6sN/7HelL4t10t9F4gPdVzydEOx83Gv+uNxo7XyL/FtFl8z9ZAHF4bBsrEwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAdVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuMS4yIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPjI8L3RpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CuSSjykAAADwSURBVDgRpZFrCoNADISzxSf+8UpeQs+ol/BMguLjj+0XCPSRtZQO2CWbmcmkG87zlH9w+ybu+/5ywqUB4izLZBiGqEnUAFFRFHIch2ASS+IaIK6qSrZt0w33fRdqz+TDABLkeZ5VbH/ysixq8r5OMAJsxMRe11XF/IQQBI6dZVkKidq2Ddo3A5zZlSZ4FiF+Rp7nyuu6LmgCm2xmRjYzDDC3FHbSf1nBhJzjOJ7TNGkS6rqupWma1yiP+4SmhzRNdSo9klF7iBoQmQ8Qmb09XBqYCIOfEyRJIjwpYAVqD/7tg8lU3txA7SH6Ch7Zu7sDPheCDKEDKOIAAAAASUVORK5CYII=',
        upOn: 'data:image/png;base64,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'
    };

    var debuglog = function(str) {
        if (debug) {
            console.log(str);
        }
    }

    var makeImage = function(src) {
        var image = new Image();
        image.src = src;
        return image;
    }

    var serverRequest = function(postNumbers, vote, outputElements, successCallback) {
        debuglog(postNumbers);
        debuglog(vote);

        successCallback = successCallback || function(){};

        var onloadFunc = function(request) {
          debuglog('onload');
          if (request.status >= 200 && request.status < 400){
            // Success!
            debuglog('ok');
            data = JSON.parse(request.responseText);
            if (vote) {
                if (!data.voted) {
                    window.alert('Already voted on this post.');
                }
            }
            debuglog('request complete for ' + postNumbers);
            for (var i = 0; i < postNumbers.length; i++) {
                outputElements[i].innerHTML = data.scores[postNumbers[i]];
            }
            successCallback();
          } else {
            debuglog('fail');
            debuglog(request.status);
            // We reached our target server, but it returned an error

          }
        };

        var onerrorFunc = function() {
          // There was a connection error of some sort
        };

        debuglog('funcs');

        idsString = ""
        for (var i = 0; i < postNumbers.length; i++) {
            idsString += ("id" + i + "=" + postNumbers[i] + "&");
        }

        requestUrl = "https://boat0.webscript.io/vote?" + idsString;
        if (vote) {
            requestUrl += "vote=" + vote;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: requestUrl,
            onload: onloadFunc
        });
    }

    var getScores = function(postNumbers, outputElements) {
        serverRequest(postNumbers, false, outputElements);
    }

    var vote = function(postNumber, vote, outputElement, successCallback) {
        serverRequest([postNumber], vote, [outputElement], successCallback);
    }

    var makeArrow = function(postId, outputElement, t, imageOn, imageOff) {
        var arrow = document.createElement("a");
        arrow.href = "#" + postId;
        var image = makeImage(imageOn);
        arrow.image = image;
        arrow.class = t + "arrow";
        arrow.appendChild(image);
        return arrow;
    }

    var makeArrows = function(postNumber, outputElement) {
        var arrows = document.createElement("span");
        var upArrow = makeArrow(postNumber, outputElement, "up", imageData.upOn, imageData.upOff);
        var downArrow = makeArrow(postNumber, outputElement, "down", imageData.downOn, imageData.downOff);
        var makeOnclick = function(t) {
            return function() {
                vote(postNumber, t, outputElement, function() {
                    debuglog('callback called');
                    upArrow.image.src = imageData.upOff;
                    upArrow.onclick = false;
                    downArrow.image.src = imageData.downOff;
                    downArrow.onclick = false;
                });
            }
        }

        upArrow.onclick = makeOnclick("up");
        downArrow.onclick = makeOnclick("down");
        arrows.appendChild(upArrow);
        arrows.appendChild(downArrow);
        return arrows;
    }

    var posts = document.getElementsByClassName('post')


    var threadIds = [];
    var scoreDisplays = [];

    var addVotingToPost = function(el, i) {
        debuglog(i + ": " + el.id);
        var postInfo = el.querySelector('.postInfo');
        var span = document.createElement("span");
        var score = document.createElement("span");
        var postNum = el.id.replace(/[a-z]*/, "");
        debuglog(postNum);
        threadIds.push(postNum);
        scoreDisplays.push(score);
        span.appendChild(makeArrows(postNum, score));
        span.appendChild(score);
        postInfo.appendChild(span);
    }

    Array.prototype.forEach.call(posts, addVotingToPost);
    getScores(threadIds, scoreDisplays);

    var delform = document.querySelector('#delform .board .thread');
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            debuglog(mutation);
            Array.prototype.forEach.call(mutation.addedNodes, addVotingToPost);
        });
        getScores(threadIds, scoreDisplays);
    });
    var config = { attributes: true, childList: true };
    observer.observe(delform, config);
})();