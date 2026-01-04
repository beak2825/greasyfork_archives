// ==UserScript==
// @name            Big "go to new post" button (improved)
// @description     Replace "Go to first new post" button with a bigger one.
// @description:pl  Większy przycisk prowadzący do pierwszego nieprzeczytanego wpisu w wątku
// @version         2
// @namespace       https://github.com/skalee/ssc-grease
// @author          el nino, skalee
// @license         WTFPL
// @homepageURL     https://github.com/skalee/ssc-grease
// @supportURL      https://www.skyscrapercity.com/showthread.php?t=2017475
// @grant           none
// @run-at          document-end
// @include         https://www.skyscrapercity.com/forumdisplay.php*
// @include         https://www.skyscrapercity.com/usercp.php*
// @include         https://www.skyscrapercity.com/subscription.php*
// @downloadURL https://update.greasyfork.org/scripts/373388/Big%20%22go%20to%20new%20post%22%20button%20%28improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373388/Big%20%22go%20to%20new%20post%22%20button%20%28improved%29.meta.js
// ==/UserScript==

(function() {
  let GO_TO_NEW_POST_BLUE =
    "data:image/png;base64,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";

  // Gray alternative
  let GO_TO_NEW_POST_GRAY =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABG" +
    "dBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAATQSU" +
    "RBVHjarFdbSBxnFD6OVwLqEs3GG966VWmiaNXGh+JbBdF4a4paC0Lpm6Kiry2UPgRFFAsmVZ" +
    "GC1KZgKAWD9fbQBwsKWnWlCnbrpVJRN8Stl1bXa8/3958y7u6sk6YHvmVn5sz//ef85zY+1d" +
    "XVZFB8GEmMNxl3GBHyvp2xxPiJ8Qvj3MhifgZ0bjDeZbzHyGJE6ujZJfm3jKeM/VchBtlDhg" +
    "UXFxcXdHZ2Rufn53R5efmPG3x8yNfXl/z8/MyKouTzLeATxseM/pclhpWfMz7CBchOT0/JZD" +
    "JRbGwsRUVFUWhoqFDc39+nra0t2tjYoN3dXWyA/P394/jRV3ITNYw/jBDfYjxj3INVR0dHFB" +
    "8fT3l5eZSVlSXIPcne3h7Nzc3R6Ogora6uUmBgILEH3udHdxkFjN+vBIxLcMHSHxhvqe4sKS" +
    "mhoqIiCggIMBSB8M7w8DANDAyIaxwDyyLjba3lvunp6dr3uhiFOEucXW1trbBUvmxI2EpKTk" +
    "6mhIQEmpmZERvhe2YZJ089EZcwWmAllEGak5PjHrp2O/X09FBwcDCZzWbdDURGRlJcXBxNTk" +
    "4KIxhv8O01hlVLHMT4jnHz+PiYiouLKT8/322x7e1tam5upoWFBXGeKSkpFB4erkseEREhPD" +
    "A/P4+Aw617jF6GU9FYa4Gl0dHRVFZW5rYIPNHZ2Umbm5siok9OTqi1tZWWl5e9ur6wsJASEx" +
    "NFVrBEMSrFkcjnH+AHDwsKCkREupUtdldmZiap+Yy0gXdaWlqEB3TzlfUQnAhWKVXwNIijGd" +
    "lYDKmSnZ2tu0hpaSlVVlYKQngAi8Ly9vZ2r+QZGRniSCQ5zvY1Rf4xw80IhpCQEK+u80SOd7" +
    "2RBwUFCXdDjyUYpVeRCS52g4pkRJDbFRUVorio7lTJrVarx3cQO/CqlNdBfFu9us5aV8vLy8" +
    "vVoPmXvK2tjVZWVtz0EZBqfUf2KPQK4hqECEB4ThNIui0WxM/Vq4ODA8OkKIv9/f3CUvWoIA" +
    "0NDZSUlOSmj7WxMSkORdZRURbRZYyS9vX1CYtVKyF1dXW6WYH8RzGRYsO/OcYL7Hx9fZ0ODw" +
    "//d1Kn0yk6lvTOnxgYFNmuprEbh8MhCrueDA0NXSFFMMFT9fX1XvMfkY4aL5uNVbUYofYEd1" +
    "BPsbgaqa4lc2JiQqQENglS6Dc1NYk+rSfQHxwc1Ha4b9A9VadjTvoNrsAkAUVPJbOmpkZ0JA" +
    "QKFmpsbKTU1FSvRzMyMkI2m01tEgjkr7XdCSZuMx6AfGlpSfRTtDbXXExLS6OdnR2qqqoil1" +
    "7uJlinu7tbbFJGdBPjR9d+/DMjhRXuwq3T09Ni5EFr0wqKTG5u7rVVbnFxkTo6OkQtl27+nt" +
    "GoN4GMM+5jYsAZTk1NiZHHYrFoc/BaGR8fp66uLkEqIxml7D7jLz1ipxz03mHy27B8dnZWFH" +
    "9EclhYmO7shboN3d7eXhobGxNWSkttctr0OuypYpLzV7nap5GvaG04+5iYmCvjLYrD2tqaSB" +
    "lEvGZzz+SIbHcL1ms+YT5kfCZ7tiDHESBFtAM9yOBSTcqA6FPGF//1S+JLOYthPn7AC6czTD" +
    "q6+GRZkKn5xJOVL/vt5GA8YjxGH8VAIT/ebsoPuV3Gr7L0Gv5o+1uAAQCFQwe1FvZLtwAAAA" +
    "BJRU5ErkJggg=="

  let SELECTOR_GO_TO_NEW_PIC = "*[id^='thread_gotonew_'] img"
  let SELECTOR_TEXT_NEAR_GO_TO_NEW = "*[id^='td_threadtitle_'] > *"

  for (rowInCell of document.querySelectorAll(SELECTOR_TEXT_NEAR_GO_TO_NEW)) {
    rowInCell.style = "margin-left: 35px;"
  }

  for (new_post_pic of document.querySelectorAll(SELECTOR_GO_TO_NEW_PIC)) {
    new_post_pic.src = GO_TO_NEW_POST_BLUE
    new_post_pic.style = "float:left; cursor: pointer; opacity: 1.5; " +
      "width: 30px; height: 30px; margin-left: -35px;"
  }
})();
