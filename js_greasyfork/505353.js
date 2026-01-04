// ==UserScript==
// @name         Der Standard - Basislager Favicon and Theme
// @namespace    http://tampermonkey.net/
// @version      24.0.0
// @description  Replace the current theme in a ticker.
// @author       Winston Smith
// @license      MIT
// @match        https://www.derstandard.at/jetzt/livebericht/2000130527798/*
// @match        https://www.derstandard.at/jetzt/livebericht/2000133087737/*
// @match        https://www.derstandard.at/jetzt/livebericht/2000134489588/*
// @match        https://www.derstandard.at/jetzt/livebericht/2000135886471/*
// @match        https://www.derstandard.at/jetzt/livebericht/2000137241138/*
// @match        https://www.derstandard.at/jetzt/livebericht/2000138443314/*
// @match        https://www.derstandard.at/jetzt/livebericht/2000139914652/*
// @match        https://www.derstandard.at/jetzt/livebericht/2000141504301/*
// @match        https://www.derstandard.at/jetzt/livebericht/2000142622431/*
// @match        https://www.derstandard.at/jetzt/livebericht/2000144473769/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000108553/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000179807/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000186882/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000194352/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000201552/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000209412/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000220186/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000228986/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000238440/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000249530/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000258574/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000272333/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000285971/*
// @match        https://www.derstandard.at/jetzt/livebericht/3000000299289/*
// @icon         https://www.google.com/s2/favicons?domain=derstandard.at
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505353/Der%20Standard%20-%20Basislager%20Favicon%20and%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/505353/Der%20Standard%20-%20Basislager%20Favicon%20and%20Theme.meta.js
// ==/UserScript==

// Theme used for the tickers (e.g. theme-panorama for green background).
const THEME = "theme-zukunft";

var favicon =
    'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9' +
    'kT1Iw0AcxV/TSkWrDnYQcchQnSyIijhqFYpQIdQKrTqYXPohNGlIUlwcBdeCgx+LVQcXZ10dXAVB' +
    '8APEzc1J0UVK/F9SaBHjwXE/3t173L0DhHqZaVZoDNB020wnE2I2tyKGX9GNEHoRhigzy5iVpBR8' +
    'x9c9Any9i/Ms/3N/jh41bzEgIBLPMMO0ideJpzZtg/M+cZSVZJX4nHjUpAsSP3Jd8fiNc9FlgWdG' +
    'zUx6jjhKLBbbWGljVjI14knimKrplC9kPVY5b3HWylXWvCd/YSSvLy9xneYQkljAIiSIUFDFBsqw' +
    'EadVJ8VCmvYTPv5B1y+RSyHXBhg55lGBBtn1g//B726twsS4lxRJAB0vjvMxDIR3gUbNcb6PHadx' +
    'AgSfgSu95a/UgelP0mstLXYE9G0DF9ctTdkDLneAgSdDNmVXCtIUCgXg/Yy+KQf03wJdq15vzX2c' +
    'PgAZ6ip1AxwcAiNFyl7zeXdne2//nmn29wMWkHKC6r7HvAAAAAZiS0dEAOYA/wAA4E+97QAAAAlw' +
    'SFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+ULBA4IDyAXPEQAAAAZdEVYdENvbW1lbnQAQ3JlYXRl' +
    'ZCB3aXRoIEdJTVBXgQ4XAAAEoElEQVRYw+2Xe2xTdRTHP31u7VrYGLDRDdjcgw1IBAwII8rUgfjA' +
    'ZQLGwCTTkCgGiYkJ+gfJ/pAgwcRAYgwhhojiI/4zlbAQTSQsQTa2jLJlOJTR1Y0Otq5sbGtvbx8/' +
    '/9ivg+se3UriP3qSm957zrnnfs/jd84p/NdJF0eeB1QBS6RuG/A50C2vncCFhwGgjyPfA7wGBIGA' +
    'fO4CokAWsPDfjpgJ2AzsBgRQ+bAGjRPwKoCt03x/jwT0TzoLfJtoDawGLi9+pIikZMuMPQoGFdwd' +
    'vyvAGqA1kQg0Aj2z56QvmDsvM6GwhsOh5FvuG8eB9YkW4fl7A77JjNN720Nnx3U83Z0E/CPjdBbn' +
    'FgCUAE/GA2CYhJ8R8AdeWJSbr2EqAT9N9RcoLiqkvLwcu83KmZrvsM1KJcVmvx9Wkwk1FGJo0GcE' +
    'amaaAoDGoDKCGgxiTkoCQAjB9TYnb+3Zy6s7KjEYRl/dUPoMVZXbKSl9jmSLdczA3HmZ3HLf2JRo' +
    'CpwAalDReN/f18OWlyrweDyEw2G6uv5iSVExOyqrGLjr1RiwptgAMoDsRACEgY6gqmhyD2Cz2zl1' +
    '8gReb9/YryMrm0g4om0YZnPsNiuRFADcURUlL/ZgsaQA4LrZwYHqgwAcqD6Iqqr8drFOE34Ao9EU' +
    'u12QaCu+GfM6VlgFS1dw5PCH+Hz9Y/zTX57k2rV2UufMnWmhx42APxDwaxjZi3I5f66G99/bR15B' +
    'IW6Xi6bGelatLcVg0H4nEhlLye1EAehEVGgZOj06nY6rzmauOpslT4dePz6Q4dBY9IYSBTAhPbX5' +
    '5Wm25AByYLUlCkDo9ONHRTQaJRRSQQjNSDGaTJo0+EeGY8c5Eg/A03LxqAEePMxWvd7AgM+Lf2SY' +
    'oaFB+m7fQh31bEJKsacyPzOL1LR0+vvuAJyfRHU58CIwH+CUDFUEOCdnfTpQL/n3gF+BY8CbwCZg' +
    'lZS9DeQAK4BS4B3ge2BQysvkB+1AOXBCblIC6AWOA7jLMxaKE6s3iI8fXSuWWWwxMCPAtqlSNMVC' +
    'YgUOA/uBX4CQ1L8EVAOPP6i8Drj4xqIC4d2+W3i2vi7qNlaIfXnLBDAsjdhmAGAV0A6IjemZ4ujK' +
    'ErE3b6kATk+1kDwPnP16XRnPZueMnmMRpa6nm0POBq6MDA4APwA/y6pul3viLsnLkQvIFmDjgeKV' +
    'bMstJDtldEIecjbwyZ+tn8oUTboRfeQwmj9oqdilHcGRMM3eXi71ejh6vYWAiE4Y8zX2NLblFvJE' +
    'ZjYFs9Pu94NolHVnvsGlKlWy3iY9hq4kw/iumWwwUpLhoCTDwbvLH8MXDDAcCqFEwuh1OuwmMxaD' +
    'kbSk5AmBtQ3041KVWIFPOQvcrmCAoZA6Tqm2y0VtlwuDTsf+hjpMej12k5nDzss4rDYu9fZQ2+Ua' +
    '38vDIT5ruwLwBXAn3lJqBjqPrVy/YGd+sUbpnjoKapbZjMc/zPzk0cnXq/hxWG0aeYy8SoAjLY2c' +
    'dP/RKQvz7nS24jLgp335yyxljsXYTKYZtWkhvW7x9VHd2kQYUQ+8Iv/MTJuWA1890DBmevUAP8bp' +
    'If/TGP0NdyK9WN3Y6MYAAAAASUVORK5CYII=';


(function() {
    document.documentElement.classList.add(THEME);
    document.documentElement.classList.remove("theme-diskurs");

    // Change favicon
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = 'data:image/png;base64,' + favicon;

})();