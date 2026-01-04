// ==UserScript==
// @name         Surviv.io - Nice Crosshair
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @icon         https://i0.wp.com/cdne.c3dt.com/icon/2341510-com.bvtvideo.shotkampro.jpg
// @description  Change the crosshair in the game!
// @author       VNBPM
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://38.180.95.14/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436138/Survivio%20-%20Nice%20Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/436138/Survivio%20-%20Nice%20Crosshair.meta.js
// ==/UserScript==
// New crosshair

(function() {
    'use strict';
    window.addEventListener('click', function() {
        try {
document.querySelector("#game-area-wrapper").style.cursor = 'url(aWKpgc6lU2YZpuYRDimmOIcbTodiOU3Fykni7A+1DFG847B72/NeRycdd+9xZj3bbbz33u/5fd7f7/c87/d5UHgKpqrqBqAEuA68CVQDI4D1iqJ8EMwUSjCD3WNVVS0HilVV7Txz5kxeRkZGnaIoQ4DViqKsD2aOYADDgTHASw0NDYtzcnIybTabo7CwsKa6utocERFhsFqtjXPnzt0L/ARcBh4GCjsQwDhgCjAJGCQT1tbWZplMpvS+gFVVVc0Wi6XFA+oc0ATc0gsaKOBrQE6v84kTISOD2pKSLFNCQrpNVR2FilJTDeYIMFS1tzdbKitbOHkSTp3yZDoJfAP0+APVCxgPzANe1BwWFEB+PuTkwNCh1EKWCdJt4CiEvwGh2QItOJ1QVweHD8OhQ9DVJV5uAweBn31B6gEUqPlAFGPHwqJFMH8+hIX1+vUL6Emwdy/s3AnNzfKtCnwGXOoP0h9gIrAEiGTmTCguhunT/+ErIEAZff48lJfDgQNuX7uAq94gfQFKlBYDL2AyQVkZjB7t9UEDBhQvN2/C6tUgKwqPgArg174T+AJ8A5hAZiZs3AiTJGi924AAxdW1a7Bihetswg/ATr2AqcAiCQDtvEhQ+LABA4rPxkYoKoIbN+TKCmiH0239reBSYBTLlsGWLT7h5GZQgOJg3TpYs0b++g144tXoDXAUsJT4eFdqkFznx4IGvHULcnPhwgWZaR/wra8VlP2crKWS3bv9sWn3gwYUJ6WlsEE0B61ApS/A94HnOXgQ5sx5doAnTnimsHeBbplcUVV1rJuisbExpqKiooiYGKiogGHDdAGugnGTIaUbembDVzUw2wDhR+HSJz6S8BPO7XZXnm1vJz8/v7qoqKjdDfgLYJQLp9MZ4nA4wgkJgXBJg/osDEK7wXEd7q6CU5thygiIDYfwxzret72zOBwCQWho6GP5AF2ygnbAoA/F+6+coG6DphBQUiDmItwdCoYFkBmMX9lmAVzsdtLQ0JDa2tqapr0xZswIyHcJfG+HJQYIewR2I+wqh5cDcnL6NJw9S1JSUpvZbP7OvcU1QJJcdHR0RHd0dAzBaERLMzpNztsqOFEKkxMhth3ufARnPoRpdnDodCMA2icqKuphXFzc70D709pi5z5osULbZXiQBs9ZIGU2jPOnRvzAa1t8RGS7/NDhcIR1dnZGM2gQWiTrtGgwhkJIJ9jegrovwRQJg3vgjwcuIaDP7t+Hnh6MRmNXRESExMaPfR9QqNYQG+vSa8nJuhw/lUR9756mzjUBAduANu0MeiEoBeLZswcslmcHeOQIvP66zCfpZYVkvf4A84BpzJsH+/c/O0BJ0i5hIi/kz90Te1tBUdHvaJEsYsGLgu5LHfQWX70Ks2a5t/dTzxKgvyCTGmSMXsEQNKCI1s2b5bmlHP3YcwH6AxwJLCM0FHbsgAULfG51UIBS5S1cCBIksAe4qAdQfpMLTCctzSX5pWjqxwYMeO4crFwJomRA3hxf9J3CXx51KeupU2HtWsjO9orYF9AK5kgp3N11sbdRUtmJiq6vl7t3AIkQW6CA0gCSsnO4pqyXL/danwQMePw4bN0KklpciXxHf+0QfysoDmKBt4FEEhJc51HUdqIEu8t0A0pHobIStm+H69Kpo+Ovc6dpP2+mB1DGiRwTeZ2uOZEtz8tzKZ7UVP+AUnPIVkp5eeyYm0M6XtL60KIjWED3+AxAoiVa+2LkSBg/ntqysixTcnK6zel0FN6+XWMdPtwcGRJiqLpypdmyaVOL1jhq095cYtIwOgpokeHP9K6gpx9puUn7bYJ2Nr2036xWqzkyMtLQp/0m23kWkM6W1j3SYwMB9PQrjaWUpqamkuzs7Fftdnt3QUGBu4E5uL6+/uvc3Fyp0EQByJYGbMECahO6W8DAfeAV6RcAooz+0xZw72r4AHxPUZSygJfNY8C/vYL/G0Bv/4aQOmdtsCv4J+qfjQIOi+7nAAAAAElFTkSuQmCC) 20 20, default';
        } catch (e) { }
    });
})();