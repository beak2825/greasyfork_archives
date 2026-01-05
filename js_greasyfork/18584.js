// ==UserScript==
// @name        GlobalBackButton
// @namespace   https://www.ipresent.com
// @description Add an on-page back button to every page for fullscreen users
// @include     *
// @exclude     http://www.ipresent.com*
// @exclude     https://www.ipresent.com*
// @version     2
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/18584/GlobalBackButton.user.js
// @updateURL https://update.greasyfork.org/scripts/18584/GlobalBackButton.meta.js
// ==/UserScript==
$(document).ready(function () {
  var backButtonElement = '<img id="GlobalBackButtonAddon" style="position:fixed;top:10px;left:10px;z-index:9999;cursor:pointer" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAW0SURBVGhD5Zs9Sx1ZGMdTbJEyRYp8gBQptkixHyJFyogIayGsjY2LxG7FQJCAICkWGxvBlFuIIPgBtrARLEUW398VEXzF17P/33BnmDn3uffOnXvmGvSBHzrPnDnn+Tvn/YwvnHPPCtP5lDGdoVlZWXkj3ouP4g/xpfLzg8D/xnquDExnq0jAW/FZ/CtcTm4F6XnurZVvCExnEQhSfBVLwhLULORDfkHFm85mUECvxHdxJazA3fr6utva2nK7u7vu8PDQHR8fRz/39vYiP/et5yqQL/m/tspvFtOZBwXwUlD9TkQmyNXVVbe/v+9OT0/d3d2dkje2+/v7KP3BwYFbW1vL5FeBcmj7L5XcjCkPprMRKvSd+E9kgtrZ2XEXFxdR8K3Yw8NDlA81wi9DbIn3SmbG1gjTWQ8VRs96Vik8YnNz052fn+t2eEM41T5dnqD8T7ptxlgP01kLFfKnoDeNCqbqUg15I2Ua+VOOUdW/6LYZay1Mp4Uy/ztd2MbGhru+vtat9hnlUZvScYgfumXGbGE6fZQpbzYphLaatzMKbZRrtO2/dMuM3cd0plFmtNmkGtP7ll2FGxnlHx0d+aI/6papIY3pjFEm9MZJB8WbfWyxsREH43gcWyXOd7plaokxnaCHGWeToYc2+1jVuJYx/HltmnjrjtOmE/Qgk4ooI3rjMjuok5OTym/N283NjT9T+yy3qQlMpx5iupjMoBgSyjKGmt7e3spVMTs7O0sLJu5XcpvaTKceYO4aZUCVKavdLiwsuO7ubtfR0VHxFDdvcvJdLlNblUOJWfUkC4GyZlCzs7Ous7MzEhtC8OXlZVow8ZurrCqHErIkix6kVw5tdHwTExOJ0FCCMeKNY0eHXFX6qhxKmKxnmceGtKurKzcyMlIlNpRg4o1jR4dcVfoyF0pEdY4eoGduddWTNpZ9AwMDplgIYcRL3LEG9Mid0Zi5UIJkKGJGFcqWl5ejntgSClTxUEbcsQb0yJXRmLlQgmQPKtRQND8/n/TEPnRaMzMzlZRhjLhjDeiRK6Mxc5FKGGRWNT09bQoF/ggMS6GNuFM6buXKaEyLZSs1SsjMpRWj0PHxcVMoUL2ZcJRl3swrswWcFsz+cJSIQbyoMW4PDw+bQmFwcLClqWQe8yYhme2gtGA2yaNErDeLGKuX/v5+UyiMjo5GQ1PZ5q2XP8hlCuYkIErEFmoRQ1RPT0+VUJiammrbaov4Yy3okssUzBZolIh94yKGMEtwV1eXW1xcrKQq34g/1oIuuUzBLb/h7e1t19fXVyUYGIIYotphed9w0oZpi0WNDqlWO0b03NxcJWV55u2E1GzDQXppDNFDQ0OmaAg92fAtby8dbBzG6I3riZ6cnKykDG+5xmFIJQqycKBXHhsbMwUDk5PQPTdxp3TUnmmBEgSfSzeadfEHCSm62bl0slpiORfSqMKWYKDqhzLijjWgR66MxsyFEiTrYea6ofey6i0mQhjxeudP9dfDoESl7Xhg/l5WSMFN73iAEiZ7WkXn1I2MCYgvOoR5c+jce1qZXcsy3jKW3qINIbjwriUocbIvzSBe1r700tLS4+9Lgx54Ldpy8sCZVQknDzU/gDGdoIeS1RM9X5lnSyw6itrt7a0/s6r7VYDpBD3I6SEfkEQZceTSrvVsXmNW5VVl4i12egh6mAVFcj5ML1hWey5i3pYscf4mt6klxnSmUSafUplGJ+8/g2jjC4Df5TY1pDGdPsosac/AejPkqUQzRrnem4VvumXG7mM6LZTpj3QhtGkOo9tpdFBem4V/xC+6bcbtYzproYwzb5resazjVN8YerzeGL6J3GLBdNZDBbAVlHRkwF+dmU4ZRr7GW6X8XG3Wx3Q2QoX9Kh7zW8uGvXEtTGceVOjz+Zo2jQJ4Ht9L+yig5/FFvAVBCqr70/2fh3pIwNP+r5afGdP5lDGdTxf34n/V9b/7vVDnnQAAAABJRU5ErkJggg==" />'
  $('body').append(backButtonElement);
  $('#GlobalBackButtonAddon').click(function () {
    history.back();
  })
})
