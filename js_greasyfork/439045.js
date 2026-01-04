// ==UserScript==
// @name         Enable select copy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enable select copy for all web
// @author       You
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wsBDyUWhBO3cwAAA0FJREFUWMPtl79O21AUxu+JPQQbR7WQErXqEBgTVIwqVZUi4b2K0xdosvAIfQbYu/ACCJQlI6FMllBVQiQaaAJSqmJ1aBXGMEWOff11uaauyR/UQsvAlc5i+dzvd8/1vf4OY/dtACgC2AEwwO2NAYD3AKxJwkkAmwBg23bXMIymoih9IgJj7I+CiKAoSn9paalp23ZXwGwCSI4C2OSc+6VS6YCIgj8VnQATWJZ1wDn3AWyOKjssyzq4beF4WJZ1ICpRjALs2LbdvYuVj6qE2I6dKMDAMIzmXYuHYRhGE8AgCgBFUfr/CkBRlD4AMMYYhQCJRIKJZ3c+iIgFQcCIiBKRKvwT8bhW4i/muZXxAPAAcP8BZFkeqqp6Kcuyf9NJJUnyUqnUpSzL7o0SxK30W8zPz7fr9XrH930fAFzXHW5vb7cymcwXNuaGS6fT3Wq12nJddwgAvu/7e3t7nYWFhVb8XUQvgzhAuVxuBEEAAIcAXgN4CqAC4MzzPL9QKDTiExYKhYbneT6AMwBvADwRf9kPALC6utq8EUAulzsSv8sNAFKsUkkANc/z/HQ63Q1zMpnMFyFei5sNABKAdwCwuLh4NBXg+PjYAbAfF49BnFWr1U9hztbW1hGA7kin8wvCbrfb30KHNRJA07QLsfrClG/mjeu6Q0mShrIse2LPK1NyXgKApmm9sQC6rp8KAylNmewxAKRSqb6qqn0B/XRKjgRgMDc3dxoFuDqGRMQ4548YY0nGWJ5NHi8453wwGMy4rjvDOeeMsedTcvKMsaTruhoRXaND6IAdx+kBqE1ZyeHu7m4n/Abq9XpHnBhpQl7NcZxe6JTjW3BlyUzTbIiSvh0jvhEEAbLZ7EkIkM1mP4tjuzEKAsBbADBNs8HGWLIrU0pEWFtbawqIGoBnQrggTgcqlcq1e6BcLofg++JdSeTWAGB9fb1JRGNN6auoLScirKysNM7Pz79HOhucnJw4uVzuKC4eRj6fb7Vara/RHMdxeqZpNsLjVyqVrttyAXGtMSEiaJr2Q9f1U1VVe+OE4zE7O3uh6/qppmk/QmEiCorF4seRjYkA+K01W15evrXWzDCM6a1ZBOSumtMdTGpO/9f4CY26gJKVH22dAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTExLTAxVDE1OjM3OjIyKzAxOjAwXudprAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0xMS0wMVQxNTozNzoyMiswMTowMC+60RAAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC
// @grant        none
// @license      MI
// @namespace    https://greasyfork.org/users/164689
// @downloadURL https://update.greasyfork.org/scripts/439045/Enable%20select%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/439045/Enable%20select%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.oncontextmenu=document.onselectstart=document.body.onselectstart=document.oncopy=document.body.oncopy=function(){return true;}
    // Your code here...
})();