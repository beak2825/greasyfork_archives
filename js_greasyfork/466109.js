// ==UserScript==
// @namespace    i2p.schimon.user-agents
// @exclude      *

// ==UserLibrary==
// @name         User Agents
// @description  Most Common User Agents
// @author       Schimon Jehudah (http://schimon.i2p)
// @copyright    2012 - 2023, Tech Blog (wh)
// @homepageURL  https://techblog.willshouse.com/2012/01/03/most-common-user-agents/
// @version      23.04.09
// @license      MIT

// ==/UserScript==

// ==/UserLibrary==

// ==OpenUserJS==
// @author sjehuda
// ==/OpenUserJS==

const userAgents = [
{"percent":"22.2%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36","system":"Chrome 112.0 Win10"},
{"percent":"12.1%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36","system":"Chrome 112.0 macOS"},
{"percent":"7.3%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko\/20100101 Firefox\/112.0","system":"Firefox 112.0 Win10"},
{"percent":"6.7%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/111.0.0.0 Safari\/537.36","system":"Chrome 111.0 Win10"},
{"percent":"3.3%","useragent":"Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36","system":"Chrome 112.0 Linux"},
{"percent":"2.9%","useragent":"Mozilla\/5.0 (X11; Linux x86_64; rv:109.0) Gecko\/20100101 Firefox\/112.0","system":"Firefox 112.0 Linux"},
{"percent":"2.2%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko\/20100101 Firefox\/111.0","system":"Firefox 111.0 Win10"},
{"percent":"2.2%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/111.0.0.0 Safari\/537.36","system":"Chrome 111.0 macOS"},
{"percent":"2.1%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/113.0.0.0 Safari\/537.36","system":"Chrome Generic Win10"},
{"percent":"2.0%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/16.4 Safari\/605.1.15","system":"Safari Generic macOS"},
{"percent":"1.7%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko\/20100101 Firefox\/112.0","system":"Firefox 112.0 macOS"},
{"percent":"1.5%","useragent":"Mozilla\/5.0 (Windows NT 10.0; rv:112.0) Gecko\/20100101 Firefox\/112.0","system":"Firefox 112.0 Win10"},
{"percent":"1.2%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36 Edg\/112.0.1722.58","system":"Edge 112.0 Win10"},
{"percent":"1.2%","useragent":"Mozilla\/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko\/20100101 Firefox\/112.0","system":"Firefox 112.0 Linux"},
{"percent":"1.1%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/111.0.0.0 Safari\/537.36 OPR\/97.0.0.0","system":"Chrome 111.0 Win10"},
{"percent":"1.1%","useragent":"Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/111.0.0.0 Safari\/537.36","system":"Chrome 111.0 Linux"},
{"percent":"1.0%","useragent":"Mozilla\/5.0 (X11; Linux x86_64; rv:102.0) Gecko\/20100101 Firefox\/102.0","system":"Firefox 102.0 Linux"},
{"percent":"1.0%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36 Edg\/112.0.1722.48","system":"Edge 112.0 Win10"},
{"percent":"1.0%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/109.0.0.0 Safari\/537.36","system":"Chrome 109.0 Win10"},
{"percent":"0.9%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/113.0.0.0 Safari\/537.36","system":"Chrome Generic macOS"},
{"percent":"0.8%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/16.3 Safari\/605.1.15","system":"Safari Generic macOS"},
{"percent":"0.7%","useragent":"Mozilla\/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/109.0.0.0 Safari\/537.36","system":"Chrome 109.0 Win7"},
{"percent":"0.6%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko\/20100101 Firefox\/111.0","system":"Firefox 111.0 macOS"},
{"percent":"0.6%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36 Edg\/112.0.1722.64","system":"Edge 112.0 Win10"},
{"percent":"0.6%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36 Edg\/112.0.1722.68","system":"Edge 112.0 Win10"},
{"percent":"0.5%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/110.0.0.0 Safari\/537.36","system":"Chrome 110.0 Win10"},
{"percent":"0.5%","useragent":"Mozilla\/5.0 (X11; Linux x86_64; rv:109.0) Gecko\/20100101 Firefox\/111.0","system":"Firefox 111.0 Linux"},
{"percent":"0.5%","useragent":"Mozilla\/5.0 (Windows NT 10.0; rv:102.0) Gecko\/20100101 Firefox\/102.0","system":"Firefox 102.0 Win10"},
{"percent":"0.5%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/99.0.4844.51 Safari\/537.36","system":"Chrome 99.0 Win10"},
{"percent":"0.5%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36 Edg\/112.0.1722.39","system":"Edge 112.0 Win10"},
{"percent":"0.5%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko\/20100101 Firefox\/113.0","system":"Firefox Generic Win10"},
{"percent":"0.5%","useragent":"Mozilla\/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko\/20100101 Firefox\/111.0","system":"Firefox 111.0 Linux"},
{"percent":"0.4%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko\/20100101 Firefox\/102.0","system":"Firefox 102.0 Win10"},
{"percent":"0.3%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/110.0.0.0 Safari\/537.36","system":"Chrome 110.0 macOS"},
{"percent":"0.3%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/16.4.1 Safari\/605.1.15","system":"Safari Generic macOS"},
{"percent":"0.3%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36 Edg\/112.0.1722.34","system":"Edge 112.0 Win10"},
{"percent":"0.3%","useragent":"Mozilla\/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36","system":"Chrome 112.0 ChromeOS"},
{"percent":"0.3%","useragent":"Mozilla\/5.0 (Windows NT 10.0; rv:111.0) Gecko\/20100101 Firefox\/111.0","system":"Firefox 111.0 Win10"},
{"percent":"0.3%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/16.2 Safari\/605.1.15","system":"Safari 16.2 macOS"},
{"percent":"0.3%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/112.0.0.0 Safari\/537.36 OPR\/98.0.0.0","system":"Chrome 112.0 Win10"},
{"percent":"0.3%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/113.0.0.0 Safari\/537.36 Edg\/113.0.1774.35","system":"Edge Generic Win10"},
{"percent":"0.3%","useragent":"Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/113.0.0.0 Safari\/537.36","system":"Chrome Generic Linux"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko\/20100101 Firefox\/112.0","system":"Firefox 112.0 Win7"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/108.0.0.0 Safari\/537.36","system":"Chrome 108.0 macOS"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/108.0.0.0 Safari\/537.36","system":"Chrome 108.0 Win10"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/16.1 Safari\/605.1.15","system":"Safari 16.1 macOS"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) SamsungBrowser\/20.0 Chrome\/106.0.5249.126 Safari\/537.36","system":"Chrome Generic Linux"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Windows NT 6.1; rv:102.0) Gecko\/20100101 Goanna\/6.0 Firefox\/102.0 PaleMoon\/32.0.0","system":"PaleMoon Generic Win7"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (X11; Linux x86_64; rv:109.0) Gecko\/20100101 Firefox\/113.0","system":"Firefox Generic Linux"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko\/20100101 Firefox\/110.0","system":"Firefox 110.0 Linux"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/111.0.0.0 Safari\/537.36","system":"Chrome 111.0 ChromeOS"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/110.0.0.0 Safari\/537.36","system":"Chrome 110.0 Linux"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/79.0.3945.88 Safari\/537.36","system":"Chrome 79.0 macOS"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit\/605.1.15 (KHTML, like Gecko) Version\/15.6.1 Safari\/605.1.15","system":"Safari 15.6.1 macOS"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko\/20100101 Firefox\/113.0","system":"Firefox Generic macOS"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko\/20100101 Firefox\/110.0","system":"Firefox 110.0 Win10"},
{"percent":"0.2%","useragent":"Mozilla\/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko\/20100101 Firefox\/110.0","system":"Firefox 110.0 Win10"}
];