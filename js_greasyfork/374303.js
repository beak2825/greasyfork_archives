// ==UserScript==
// @name        Torrent Utils for Torrentz
// @author      nameForgotten
// @license     MIT
// @namespace   nameForgotten
// @match       *://*.torrentz.com/*
// @match       *://*.torrentz.eu/*
// @match       *://*.torrentz2.eu/*
// @match       *://*.torrentz2.is/*
// @match       *://*.torrentz.me/*
// @match       *://*.torrentz.ch/*
// @match       *://*.torrentz.in/*
// @version     1.3.1
// @description Magnet link Dwonload and Tracker List Copy for Torrentz
// @downloadURL https://update.greasyfork.org/scripts/374303/Torrent%20Utils%20for%20Torrentz.user.js
// @updateURL https://update.greasyfork.org/scripts/374303/Torrent%20Utils%20for%20Torrentz.meta.js
// ==/UserScript==


/*
 *  NOTE:
 *  - this script is rewritten based on <https://greasyfork.org/en/scripts/7088-torrentz>
 *  - the magnet icon is from <https://www.easyicon.net/1088532-magnet_icon.html>
 *  - the clip icon is from <https://icons8.com/icon/11864/clipboard>
 *
 */

(function() {

    var openMagnet = function(magnet_uri)
    {
        var xhr = new XMLHttpRequest();
        xhr.open('get', magnet_uri, true);
        xhr.send();
    };

    var generateMagnet = function(hash, name, trackers)
    {
        var magnet = 'magnet:?xt=urn:btih:' + hash + '&dn=' + encodeURIComponent(name).replace(/%20/g, '+');
        if(trackers)
        {
            for(var i=0; i < trackers.length; i++)
            {
                magnet = magnet + '&tr=' + encodeURIComponent(trackers[i]);
            }
        }

        return magnet;
    };

    var copyToClipBoard = function(text)
    {
        this.hiddenTextArea.value = text;
        this.hiddenTextArea.select();
        document.execCommand('copy');
    }

    var copyTrackers = function(){
        var i, tracker_list='';
        for(i=0; i < this.trackers.length; i++)
            tracker_list += this.trackers[i] + '\n';

        copyToClipBoard.call(this, tracker_list);
    }

    var copyMagnetList = function()
    {
        var checkedBoxes = document.querySelectorAll('input[class='+this.selectButtonClass+']:checked');

        var magnetList = '',i,magnet;
        for(i=0; i< checkedBoxes.length; i++)
        {
            magnetList += checkedBoxes[i].nextSibling.href + '\n';
        }

        copyToClipBoard.call(this, magnetList);

    }

    var createButtonStyle = function(){
        var styleElem = document.createElement('style');
        styleElem.appendChild(document.createTextNode(''));
        document.head.appendChild(styleElem);
        var styleSheet = styleElem.sheet;

        styleSheet.insertRule('.magnet-icon { background-size: contain; background-repeat: no-repeat; display: inline-block; padding-right: 5px; margin-bottom: -3px; }', 0);

        var magnetIcon16 = 'data:image/png;base64,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';
        var magnetIcon24 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH3AofFgsmwrCqaAAABYRJREFUSMeNVU1sXFcV/u7Pe+++8XjG49jNeOyxYzulhEqlRFRtCk0UR1GUAhXd0VIJIVR1AURi0Yh204BIJQQkdEEtoTYtKxBIoAqkql24rRtBQoqKaEmKapqmyHHG8cx4PH/v595zurATJ5Gd8Elnda++75zvnnOuwE0ws7uE/81exo7HRtG5FJczRXP78tmVv2aKJlJGYtcfP8atIG9GPj9bw45Hylj5sD0+vG9weuLRkd8NTw3+YP6NJZO2LP728NgtBdRm5LWFGON7+tGuJOPlA4PT5amBg9li0BP0e/eZgmfPv7J4pqcY2CfuKuCFDxr/v8DM7hLqiwmGJjJoVeKJ8pcK0+X9Ww54RsC1LUxe+WbQ3xX0efb8q9Uz4YBnH9+Rx4sfrtxaYGZ3CY1qiuJYiE7TTg5PZp4vjocHvIIECwbIgRIHk5NeOODtCnsVVd5t/j3Ia3tibmMBeS35ct2iWDZoN+1kacw8P7TNHKCuRev9Fmw1AtIUSBPYZgzTw5mwoL6duc0vKn/Tp4S4Qr5YSTC2zaDdpsmhEX+6OBrsdxqwDgAzVK9CZrsHLydBjlE9Fy8v/KP71OJ73Rd6RzzrYr5KOjV78foK7vmCQXl0jbzkTxeHvP0pEeLIwaUOzhKSWorWuQhxJcLSe53l+dPtwzO/X/h1uEVb12HsfTaPvW8NQWuB0w+NrFcws7sEJYFuxP3DJe/lYsn7WqqAxPFqedfUSg7odml5pWYPn3yl/uLd9+dI+wJLcy7Yvi/4ptTCfHIqebmvJDueAe798zw0EfDIbEX85cGhbxUK8sHIOaTJFfPWwcRoNajeWKLD/5ppn/j8/TnyAoEL77J/11e875bvkT/WAZSWesvZ1+zPi3eI7umvlqAev70XD5ezE/198mfaYGucEtjxehCDUkZrmeordTo8935yYvtOQ9oXuHwR/p17xPdGd/KR3Bab1drpMM/3mR5J598RZzJ5WJ3rFWi1+KBU9Nk4Boj5hsyBTkfUW01+cu7f7qWxz/gkBHBpCf7kOL6/teyO9OTTbNoCmAETinD4TvlDkMLcGX1MHczk/GyWn/A92knE12fvGJ0O6u0mnjz/EV4aHZekJFDrCH/bIA4N5HAEzFnoFErb1TlJHfzAeWGW71USpE2AEMxFmzqIG3wnEoi66k9LVfWb8qgjKYBaJPxyHx/qz9AzxJStX2a0uxqD2y1MzgEMWAukHTbW6lEppJDsSLuE4BIHF69F4oDUQRDzXBxyRjMuRcof6aVDhcA+YynNNrsWLnHo1hiVsx66VQY7i3YV8aX/+r+oXPCfVo+N5ZUn3UFF9nNMq4/Ka1ZpZoRKbBvJ2ogguGjcd3LaPmUpzXYTBrn1+2kXiFYEmBHXFswvL5zr/Ulvn63rk7Snvd+9/pF1DAm6pj8ZkRDIqKS/X7qfCiFaDMp1Eqcjx+vDsXYXAJp1HTVWwuc6cXA0PxA3c4UU4s0HbgMLuc9z0R8UpYUNN6IApBBwzCDGhiChY6v845EzR0OTtrL5BMtVA01Cg6U+5Wz6GmzyDcGEG2YYDjcHSxWT5x1LpXnWF7bFlrFcNZiavQjNQkKmUdsp/zk4t0ck3aErImIzwjVzGACUjkgHx50XHlXOtgGGE+rqwpOCCaw9NL6495TzzNOkTMU5AbIEt0msnjFI6Mh55pgLeo4Kl7bBBBbyum16dV1DCFC+X8ra4gOI4h+JJP4yrFWrpl9jvBCAUoDvL3BgjnMY/kqkaUcwYe/Jysb/wbqIhIg6YBMWkSRfh7WPIrV3gJwHZgEpLbT+BFq/Ac/7Lef7/ilWGg5MmNqA/DqBqyJaA0kCNBrA4OAA0nQMRFsBaAhRh9YfY3xiHv/5gKA9gAlTby9s2gCfAkC3APvzRVHqAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA2LTI4VDIxOjMxOjA0KzA4OjAwguphvwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMi0xMC0zMVQyMjoxMTozOCswODowMGpLe9MAAABDdEVYdHNvZnR3YXJlAC91c3IvbG9jYWwvaW1hZ2VtYWdpY2svc2hhcmUvZG9jL0ltYWdlTWFnaWNrLTcvL2luZGV4Lmh0bWy9tXkKAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA0OIdghy0AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANDh/z0egAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADEzNTE2OTI2OTgM2znSAAAAEXRFWHRUaHVtYjo6U2l6ZQAyMzg5QhQA8w8AAABidEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3QvbmV3c2l0ZS93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzEwODg1LzEwODg1MzIucG5nbh4mBwAAAABJRU5ErkJggg==';
        styleSheet.insertRule('.magnet16 { width: 16px; height: 16px; background-image: url("' + magnetIcon16 + '"); }', 0);
        styleSheet.insertRule('.magnet24 { width: 24px; height: 24px; background-image: url("' + magnetIcon24 + '"); }', 0);

        var copyIcon16 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADgSURBVDhPY8AFJq5cKdq/ZO2e/iXrdoHYUGHcIDQ0lNk1KrnVNSplVc2E2Y+bpy143TJr8QkQbpq64DVIDCQHxC0gtVBtCOASmeyVWdX0/+CJ0/8nLV3/f8KSdSgYJAaSA6kBqYVqQwDnqOSo9imz/4PAs1dv/996+AQFP3v9FiwHUgNSC9WGAMgG4ANEGcC88gsGXvbwN1iOPi4IP/YDAx95/QcsR5QBqx/9RsHIgD4GUOwFdM3IgCgD8AGcBiAnZXwYpMY1KtUTqg0BQBnEJSqlCZph8OFGrJmJPMDAAABHjep3UxrmRQAAAABJRU5ErkJggg==';
        styleSheet.insertRule('.copy16 { width: 16px; height: 16px; float: left; background-image: url("' + copyIcon16 + '"); }', 0);
    }

    var createMagnetLinkButton = function(size){
        var magnetImgButtonClasses;
        if(size == 16)
        {
            magnetImgButtonClasses = 'magnet-icon magnet16';
        }
        else if(size == 24)
        {
            magnetImgButtonClasses = 'magnet-icon magnet24';
        }

        var magnetImgButton = document.createElement('img');
        magnetImgButton.className = magnetImgButtonClasses;
        var magnetA = document.createElement('a');
        magnetA.appendChild(magnetImgButton);
        magnetA.title = 'download'
        magnetA.style.cursor = 'pointer';

        return magnetA;
    }

    var createSelectButton = function ()
    {
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";

        return checkbox;
    }

    var createCopyMagnetListButton = function()
    {
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Copy Selected Magnet";
        button.style.float = 'left';
        return button;
    }

    var createCopyTrackerToClipboardButton = function(){
        var copyButton = document.createElement('img');
        copyButton.className = 'copy16';
        var copyA = document.createElement('a');
        copyA.appendChild(copyButton);
        copyA.style.cursor = 'pointer';
        copyA.title = 'copy tracker list'
        return copyA;
    }

    var createHiddenTextArea = function()
    {
        var textarea = document.createElement("textarea");
        textarea.id = 'hidden_text_area_for_clip';
        textarea.style.position = 'fixed';
        return textarea;
    }

    var main = function()
    {
        var copyMagnetListButton, selectButton, magnetA, hash_url, regexp, hash, name;

        var i;

        createButtonStyle();

        /* add text area for copying text to clipboard */
        var hiddenTextArea = createHiddenTextArea();
        document.querySelectorAll('body')[0].appendChild(hiddenTextArea);

        /********************************************************
         *
         *            for torrent search page
         *
         *******************************************************/

        var links = document.querySelectorAll('.results dl a');

        if(links[0])
        {
            var header = document.querySelectorAll('.results > h3')[0];
            copyMagnetListButton = createCopyMagnetListButton();
            copyMagnetListButton.hiddenTextArea = hiddenTextArea;
            copyMagnetListButton.selectButtonClass = 'tz_select_torrent';
            copyMagnetListButton.onclick = copyMagnetList;
            header.insertBefore(copyMagnetListButton, header.firstChild);

            for (i = 0; i < links.length; i++)
            {
                hash_url = links[i].href;
                regexp = /https?:\/\/[\w\.-]+\/([0-9a-fA-F]+)$/g;
                hash = regexp.exec(hash_url)[1];
                name = links[i].textContent;

                selectButton = createSelectButton();
                selectButton.classList.add('tz_select_torrent');
                links[i].parentNode.insertBefore(selectButton, links[i]);

                magnetA = createMagnetLinkButton(16);
                magnetA.href = generateMagnet(hash, name);
                magnetA.addEventListener('click', openMagnet);
                links[i].parentNode.insertBefore(magnetA, links[i]);

            }
        }


        /********************************************************
         *
         *            for torrent info page
         *
         *******************************************************/

        var torrent_title = document.querySelectorAll('div.downlinks > h2 > span')[0];
        if(!torrent_title)
        {
            torrent_title = document.querySelectorAll('div.downurls > h2 > span')[0];
        }
        var trackers_dt = document.querySelectorAll('div.trackers > dl > dt');

        var tracker_bottom_line = document.querySelectorAll('div.trackers > p')[0];

        var trackers;

        if(torrent_title)
        {
            trackers = [];
            for (i = 0; i < trackers_dt.length; i++)
            {
                trackers.push(trackers_dt[i].textContent);
            }

            /* Add Magnet Button */

            hash_url = window.location.href;
            regexp = /https?:\/\/[\w\.-]+\/([0-9a-fA-F]+)$/g;
            hash = regexp.exec(hash_url)[1];
            name = torrent_title.textContent;


            magnetA = createMagnetLinkButton(24);
            magnetA.href = generateMagnet(hash, name, trackers);
            magnetA.addEventListener('click', openMagnet);

            torrent_title.parentNode.insertBefore(magnetA, torrent_title);

            /* Add Copy Tracker Button */

            var copyA = createCopyTrackerToClipboardButton();
            copyA.trackers = trackers;
            copyA.hiddenTextArea = hiddenTextArea;
            copyA.addEventListener('click', copyTrackers);
            tracker_bottom_line.insertBefore(copyA,tracker_bottom_line.childNodes[0]);
        }
    }

    main();

})();
