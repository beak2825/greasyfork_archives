// ==UserScript==
// @name         convert2mp3 Button (EN)
// @namespace    https://brennced.github.io/
// @version      1.02
// @description  This adds a button below a YouTube video to download it as MP3.
// @author       Jonas K (https://brennced.github.io/)
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAQAAACSoYmJAAAACXBIWXMAAAsSAAALEgHS3X78AAAEy0lEQVRoge2aPW/UQBCGXyKk5A9QIF0aktDkF1wRPhpAkVIgBFKQaEIPok5DBy2iQ0ihhwKJ4pwmQWlIR3OHUHxpkpMoaKg4myJH4bvc2ju7M7O2EyH8uknO+/F4duzdnVmgUaNGjRo1qlgXKmtpE+tMiQHuVNNVWegILQDALFqYZcqmGCAd//0IX8M7DYeO0MqhSloanf6VPUBltucVoYsYQ5zgBKPg6wQnGCJGFyv1Ax+UxqXQo7qBq8HNo9cCXh9wTeCd2oFN8F0eiH/nd9DGLFvO/Jy5JPksAgkGOPR/VfwwHSxgHnOeEhPYAW6zOMASPgLg8EdIsY+bgvYI7XidIkEfPWyHNY1txEg8jjJEjBdhyD7gUNyp3qGHvhNd6N8y5GqAp/LZXIXtQq4amAcXY9PIdQFPtFsG24X8uUbgTJHD3iz2+SFnou09xJK7SueckQEXdmwWyU8uMRas6SbFfXxSdfsCa8Svd/Mde7SLtjX1pPhCTzeUayQqXHOlXbyytbNsQURZe4gtuyDlGgmuBuDS31zd2pnCJkYqtrqT+vKWamMgBbexk2KtyLKzFNm/QikDbpsx5gr0xcg6YBPc//3dIAxpPChl51UWeAMHwcjZxWHbLmLYumhniWus4DfpFgmOvYtOHbZNtjWxWNFeEtewHWpal1sty7FtH+hmN7pW9z0W2e3Lk7quBRCF7Xsli8bpATNEsZRdV3XQ9m7CAOAm5tBn940AMIcFz91iC+O5smhp3jlcrmGP0qrIUawvsKGig4zLEgPgle1n/tqXBeBdhYm6M9hESxmGlAQCTP3AEm4xruLf8ed1YQbrSoQw7THgLU1siXoRnwdASZSBf8MhgT47jnOLREG/Z+qUGZk9LGMRxxhZdxQuSkFzulRh0iNIFPQyU+cnYSe5IsSYL/fYFPQzpo5kwqAV4QDXsVD21b9I/NYu16RDEa5g3hl/TdnxNTSDu2rL8UHdojILL2LO6RYDT21yXLQzomYal+UQEk/sasmaf3tAyNrDN5H3cuVkOQRfj0W6BNfon/nZyW3rCbQ8S+Ozs91T32U3PqxiD5rZqCat5N8lbdHOQT2NxNauRX6CI8X+nNvY2WSno2LvXSQhLBe2PKDAIds+YHj/B2I3LglmP1HsBfXI1JvT898eYkOArdkL5oH5EL29D03w1CxAfcSkUc51NbYkREHFFq1PIxXLk6ZpjlQW7mFT0CbF87hY6AnxZL/wVtC8zEF0eUfKNT5PbpprgWIwO8U+bgiat8MJVNL5O+4Jgek2D7FIF87bTBJnooM2suClpk3vrDn1JEkI0pVWCk/ddcigJvPivh5Xkbzf1WfC6Fi3oMVdJOeCvOIIHAtbjATD6wpAhnqzK59QYTrQnTsP8ebIGZw/E2RtFyunObF/BJk7LHcGyCMci9voeu17hsjZNO3eOjxA14D15xwT9PHOh6GJ9FCTq6mR88yY5kyqbPEgFH1CoXhRWXH5Ic8EfcE8TEaYaP3BAPNsQCs8RpdigEPRQTmlNKk2zaU8aqS3zPY4JleNJueoVRYOG86XWBMewnQrCDdTmTjxS6xBeoJ0Kt1BT1JVxPQ38dD4z36I/IewBOxEdSQitgtJnzd4VUMvjRo1atSo0X+vv+3cL7s4MhuvAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/23941/convert2mp3%20Button%20%28EN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23941/convert2mp3%20Button%20%28EN%29.meta.js
// ==/UserScript==

function initC2MP3_EN() {
    var tooltipText = "Download with convert2mp3",
        html = '<span id="c2mp343908">' + "\n" +
               '  <button id="c2mp343908-button7489235179"' + "\n" +
               '          class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip"' + "\n" +
               '          data-tooltip-text="' + tooltipText + '"' + "\n" +
               '          type="button"' + "\n" +
               '          role="button"' + "\n" +
               '          title="' + tooltipText + '"' + "\n" +
               '          aria-pressed="false"' + "\n" +
               '          aria-expanded="false">' + "\n" +
               '    <span class="yt-uix-button-icon-wrapper">' + "\n" +
               '      <img src="//s.ytimg.com/yt/img/pixel-vfl3z5WfW.gif" class="yt-uix-button-icon" style="width:20px;height:20px;background-size:20px 20px;background-repeat:no-repeat;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AoLFCMPchhP3gAAAAxpVFh0Q29tbWVudAAAAAAAvK6ymQAAAcVJREFUOMvV1E9oz2EcB/DXRkuSkVb+JorDHNam/L2QchCKi3ahHBx2oUgcnXaQ5KLQHChFOTgoccVyWspv0cKUjBE7mNn8+bm8v/X0a3bfpz6H5/15f97P8/087+fLbI1OXEA/6kX+xSv0ogMtM4k0YQPuFQLjGMUnfMRnfC/q99GFudMJHkhjHe9wG91ox8pke7AbGAr3N3owpxTbjR8h3MmuVTRjbXJ5gXegD5Pp66kKq/Am4FUsLJoO4gqe4gke4SK2FpyT6X2PTXA2QD+WFMTezK+Onw2X8xZ7i9lfLg7kZRpOFWJ78DWkSRzC+WIs1Ylaw28PNgZ/8C2XUsXNWKQ63foMfV0u5FdqO8JfhmHUmzP0ymNVjDes69l4Z7KyyURRn6rIA/msM4XAFowUn3w0vHKOzwpjdwUbhhNZDGBpIdqdmdQbcgrPsSK8BbiV2nWYj9cBjheCLXgY/AMe4wFOY3E4rTgXzgtsrJq34Rrasm7D3RBHsKvhVc2LF/vCGcWR/73pNYVYPabuxGbsw7FsXtlqCIdn+knsj8cqwQkMooYvBT6GSw2vRtM0gouwOn+e7TFt5bdant9gLqYWi82i+AfaxpmIF31c3AAAAABJRU5ErkJggg==);">' + "\n" +
               '    </span>' + "\n" +
               '    <span>' + "\n" +
               '      <span class="yt-uix-button-content">' + "\n" +
               '        convert2mp3' + "\n" +
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
        open("http://convert2mp3.net/share.php?url=" + encodeURIComponent(location.href));
    });
    prependChild(document.getElementById(appendToId), x);
}

(function() {
    'use strict';
    initC2MP3_EN();
    var oldloc = location.href;
    setInterval(function() {
        if (oldloc != location.href) {
            setTimeout(initC2MP3_EN, 2000);
        }
        oldloc = location.href;
    }, 1);
})();