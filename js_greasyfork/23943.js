// ==UserScript==
// @name         SearchOnSoundCloud for YouTube (EN)
// @namespace    https://brennced.github.io/
// @version      1.02
// @description  This adds a button below a YouTube video to search for the video title on SoundCloud.
// @author       Jonas K (https://brennced.github.io/)
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AoMCiMWnRxR3QAAAAxpVFh0Q29tbWVudAAAAAAAvK6ymQAABDRJREFUeNrtmcuPFFUUxn9d0zPTMA+YwmlnaEQYHwRf7NSdJqxcqQsfGBa6MDEa3RkTYxRdqAs3Rv4DFyQufCSiG4KJG6OJxqggiMjoPGhmQGYcR1SQcTHfTT5vyohtP0a4X1K5p6r6Vtf5znfOPX0bEhISEhISEhISEhISEhISEhIuLZRW2Ps8ANwObAOqwBAwDRwFPgHeAr66GANxF7B0gccU8ODF4vgpYDfwwr8gIBzfAZv/6wtkHXB6K7BDdg5cD5xr4DmbRcKd/7eov6EIonE/8GwDCvDj7pWkgFuAh2VvAyrR/VXReZcR0ije1Hd1jICKnCgD9wKP6frHwKPAKDAD9NicAY1rmkAAwAedIGAPsN2iPKCltVfnvXL+RmAYuMLmBjJWA+ebQMAQ8Hy7Cdgix3qi68NmLwH9stdF0m82nmkHARXgPnNuFLjc8nsw+nzZJF4xMpygZiED7m81AdcBL5rky9ZRrlNOx2oIEj8vqbrjeZNJ2NFqAnqivOuz54RlaTBSwEBBxQ/1oK/JBNzWagKGgZo5nOsIRS8HuiOJB1VcZtc3tqjPWKM0eBs4CBwD9gFPqeBeEAH3WLf1iOybrWr3WkRLporcol+yayEFum1uK7FHHeJWYJNWqpeBReC5vyOgD7hW9i6NVwO3yn5dD/NKngMbgLNRCjgBg8Afdi0vaITaiV3Ae0UE3GR99ZikVLUKH6p9VlDF1xcsf9VopUDzQ3r0W01pNwl3AK8GAkJEa4pmWK7WAyM6gvRrlv8Vy+vMasCgORsI6LaCGDDS4R9lTwAbMjFRlryviV5wxBzuklOhkKw1YihY5nqtKBV1evkK+GH2ZKZqPCYCtli0RuW8y7oWKSYoITc1LNkSSUFfQIEaujpEwPZMjtyg6F9p+Vwze5ORci7K8apFe5URUC1QxdqCtjmuHW3dmyhrqRtT7naZs7lFZqOR8rvsqwpa2cwi22/3V5sa+gsaqnKHCMgyYFzHgqL1vW7O2fI1rXEG+FH2ZxoXgDNmhznHbOmry/5B22DYHH9+u/F1xvIm45fANyJiSjcn7MW+1VgH5mUf1jhr1+bMwQmNk5FKStF8rI9oN/ZnispRReyQvcyUCJixCceBE7JPGSnTZv8i+6DVgON2vx7NP9Ok/YBG8EoGPK7CNm6RDs5ORPKcBk7b+UlFeNFSpB7VhkkrnPNG8Kc2pxN9wG5gPLOcnjLZLup8xlJiUQRMWiE8K0X8pPOfozRA904YAROR7Bdo/x80Hyrwf6m+n1v0jsjhur18KIC/RZI/aeezcn7OnnvaJD5vzs6aitrZB7wEPF20/PyqNAB4SOMh4B3Ze1nehx8Sg4G0A3LysMaPrE1+n+Vt7wN69hHgXVsC9+ozXwA7aez/gdI/7CeUlM77gNekuISEhISEhISEhISEhISEhISESxZ/AiWVECeJGFkoAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/23943/SearchOnSoundCloud%20for%20YouTube%20%28EN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23943/SearchOnSoundCloud%20for%20YouTube%20%28EN%29.meta.js
// ==/UserScript==

function initSOSCYT_EN() {
    var tooltipText = "Search for this song on Soundcloud",
        html = '<span id="ssc34607">' + "\n" +
               '  <button id="ssc34607-button7489235179"' + "\n" +
               '          class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip"' + "\n" +
               '          data-tooltip-text="' + tooltipText + '"' + "\n" +
               '          type="button"' + "\n" +
               '          role="button"' + "\n" +
               '          title="' + tooltipText + '"' + "\n" +
               '          aria-pressed="false"' + "\n" +
               '          aria-expanded="false">' + "\n" +
               '    <span class="yt-uix-button-icon-wrapper">' + "\n" +
               '      <img src="//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif" class="yt-uix-button-icon" style="width:20px;height:20px;background-size:20px 20px;background-repeat:no-repeat;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AoMCiMWnRxR3QAAAAxpVFh0Q29tbWVudAAAAAAAvK6ymQAABDRJREFUeNrtmcuPFFUUxn9d0zPTMA+YwmlnaEQYHwRf7NSdJqxcqQsfGBa6MDEa3RkTYxRdqAs3Rv4DFyQufCSiG4KJG6OJxqggiMjoPGhmQGYcR1SQcTHfTT5vyohtP0a4X1K5p6r6Vtf5znfOPX0bEhISEhISEhISEhISEhISEhIuLZRW2Ps8ANwObAOqwBAwDRwFPgHeAr66GANxF7B0gccU8ODF4vgpYDfwwr8gIBzfAZv/6wtkHXB6K7BDdg5cD5xr4DmbRcKd/7eov6EIonE/8GwDCvDj7pWkgFuAh2VvAyrR/VXReZcR0ije1Hd1jICKnCgD9wKP6frHwKPAKDAD9NicAY1rmkAAwAedIGAPsN2iPKCltVfnvXL+RmAYuMLmBjJWA+ebQMAQ8Hy7Cdgix3qi68NmLwH9stdF0m82nmkHARXgPnNuFLjc8nsw+nzZJF4xMpygZiED7m81AdcBL5rky9ZRrlNOx2oIEj8vqbrjeZNJ2NFqAnqivOuz54RlaTBSwEBBxQ/1oK/JBNzWagKGgZo5nOsIRS8HuiOJB1VcZtc3tqjPWKM0eBs4CBwD9gFPqeBeEAH3WLf1iOybrWr3WkRLporcol+yayEFum1uK7FHHeJWYJNWqpeBReC5vyOgD7hW9i6NVwO3yn5dD/NKngMbgLNRCjgBg8Afdi0vaITaiV3Ae0UE3GR99ZikVLUKH6p9VlDF1xcsf9VopUDzQ3r0W01pNwl3AK8GAkJEa4pmWK7WAyM6gvRrlv8Vy+vMasCgORsI6LaCGDDS4R9lTwAbMjFRlryviV5wxBzuklOhkKw1YihY5nqtKBV1evkK+GH2ZKZqPCYCtli0RuW8y7oWKSYoITc1LNkSSUFfQIEaujpEwPZMjtyg6F9p+Vwze5ORci7K8apFe5URUC1QxdqCtjmuHW3dmyhrqRtT7naZs7lFZqOR8rvsqwpa2cwi22/3V5sa+gsaqnKHCMgyYFzHgqL1vW7O2fI1rXEG+FH2ZxoXgDNmhznHbOmry/5B22DYHH9+u/F1xvIm45fANyJiSjcn7MW+1VgH5mUf1jhr1+bMwQmNk5FKStF8rI9oN/ZnispRReyQvcyUCJixCceBE7JPGSnTZv8i+6DVgON2vx7NP9Ok/YBG8EoGPK7CNm6RDs5ORPKcBk7b+UlFeNFSpB7VhkkrnPNG8Kc2pxN9wG5gPLOcnjLZLup8xlJiUQRMWiE8K0X8pPOfozRA904YAROR7Bdo/x80Hyrwf6m+n1v0jsjhur18KIC/RZI/aeezcn7OnnvaJD5vzs6aitrZB7wEPF20/PyqNAB4SOMh4B3Ze1nehx8Sg4G0A3LysMaPrE1+n+Vt7wN69hHgXVsC9+ozXwA7aez/gdI/7CeUlM77gNekuISEhISEhISEhISEhISEhISESxZ/AiWVECeJGFkoAAAAAElFTkSuQmCC);">' + "\n" +
               '    </span>' + "\n" +
               '    <span>' + "\n" +
               '      <span class="yt-uix-button-content">' + "\n" +
               '        SoundCloud' + "\n" +
               '      </span>' + "\n" +
               '    </span>' + "\n" +
               '  </button>' + "\n" +
               '</span>',
        appendToId = "watch8-secondary-actions";
    function prependChild(parent, child) {
        parent.insertBefore(child, parent.firstChild);
    }
    var x = document.createElement("span");
    x.innerHTML = html;
    x.addEventListener("click", function() {
        open("https://soundcloud.com/search?q=" + encodeURIComponent(document.getElementById('eow-title').innerText));
    });
    prependChild(document.getElementById(appendToId), x);
}

(function() {
    'use strict';
    initSOSCYT_EN();
    var oldloc = location.href;
    setInterval(function() {
        if (oldloc != location.href) {
            setTimeout(initSOSCYT_EN, 2000);
        }
        oldloc = location.href;
    }, 1);
})();