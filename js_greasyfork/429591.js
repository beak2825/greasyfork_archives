// ==UserScript==
// @name         Arabinizer
// @namespace    https://greasyfork.org/
// @version      0.6
// @description  Hamood hamood habibi
// @author       You
// @include      *
// @exclude      https://www.google.com/search?*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACnCAMAAAAPIrEmAAAC91BMVEUAAABUEhkWmlIQEBAYmVO/GSsZGRkUmFHAGisRERG/GCsUFBMRkkwanlYUFBO/GSsTl08UFBQUllDAGi0UFBQKi0UKCgm/GSsepVwtLCve293Y2NjW1tbU1NTT09O8xMAJjEYBAQEWFhYWoFXGJzkKi0a9Eya8EiUODg7GJjgaoVgOkUrNMEIQEBDCHC8oKCi5O0MMi0YODg4wr2oaoFfAGy0lJSUPDw8Ih0ImqWMPo1O/GCorKysYl1IPm1AMDAwlpmEQo1MhISELikUKCgosLCwHhUG/GCokol4LCwr////9/f38+/v6+vr5+Pj39/f19fX48vTz8/P38fLx8fHw8PDu7u7s7Ozr6urp6eno6Ojn6Ofm5ubq4+fa7OLl5OTj4+Pi4eHh4eDg4ODf39/e3t7d3d3c3NzM5Nff2Nva2trZ2djX19fW1tXV1dTT09K74MzF2s/Mz82j2r3FxsWxz7+6ysGpyLa7u7uT0K+YwauwsLB9yaCNu6Knp6d9tpdnwJCenp5ztpGZmZhauYZkqoSOjo5GtHlYqH2EhIQysWwwr2tDo28vrmourWktrGgrrGYrqmV8fHwoqmQop2MmqGIiqGE7mWcmpWDVTFspol4ko1/USlkjol3TSVjSR1choFsfnllwcHAsll0dnFcQolQOo1MRoVMRoFMbmlURnlIZmFQRnFEKn08Yl1PWOEkQm1AQmlAXllIRmU8PmU8WlVHTNkcVlE8Pl04dj1EDnUoOlk3QNEUTkk0NlEu6PURjY2MSkEwRkEvOMUMMkkoQj0rANkYMkUnRLUDOLkDML0ALj0gOjUjPKz7LLT4JjkYLi0bJKzwLikXIKToJiEMIh0LHJzgGhkFXV1cGhEDFJDbEIjQAgzzDIDIAgTkAgDfCHjDAGy2/GSu+Fym9FSdISEe9EyVAQEAzMzMyMjIwMDAuLi4xLC0rKyspKSgmJiYjIyMgICAeHh0bGxsYGBgWFhUSEhIQEBANDQ0LCwsICAgGBgUBAQEp0RieAAAASnRSTlMACwwYGRomKi4uOjs8SUpWWVxpam13eoGChoqKioqKioqKkZWWmp+fpKqtsLG6u7vHycnKy87Y2dre3uPj5ubm6Ozu7/Dx8/P1+PnAEjQAAAxeSURBVHja7V09jCRHFf5eVVd3z/7N3t7JdycMIvAfsuTQBDjFEk7MBScjYgQRIcRESCQgg4SEOSSnyJIlhBBIDhAJAQEkCMsCIYxsnXd1u3e3s/PTXf3qEcz/zvT0/9we6hecdqdnq+qr971XX72u7gNaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZqN3pKxqmUhiGtoLFrAB8ABBHQR+xYLNi5/yfoSmnjmV3j+wEO8DMAjp2zSIZgtnAWDg4QB+BeFA+i/ohj655m6MoYzxz6fnDwtlq+kg59ikTu9QZno2GOCaCr5eXQM4f+/u7bNIF8CfkYeoIpdAc4CBahQwBF+Png4cP+Zvx0hTDvBQc/ng4pBXoiCWbQIyxAX0QOAhQUfnp6Mhy4qwrd0x1zuBfs/mSOsz7oHmnvh6f3+1F+6N2wN5TG49k3B7v+0Y8AeGOM2dCdk0SShGNmWGczoXvwtIb/3Y/P1s36umHd+iPuPvgsGjWVw/yDXX/vBx5II6jYWkY0ewB8/c7d3NABvAe4O49P+5HUmrfDo53O97SaLMwL155ErG0Y6m8A91bveBRVw6+U9s21YKfzHQMF7WlMkFfKM0lGp5uxIfuyes8BeCt+/HhkbSJFEetwN9gx3bsaBF3oj1PIIEUlmy4NfWy/hgD41kUcDXpJYh1j7SwoKGhDWvk46sC/q0gDHvQUgLlawsnL/9V7kEkK/fYFYiCCnc+tUp5BgDsQERaAFBFt9IJXnunxeBjbgz5bPPALAAw4QJAA7MBy/s9EMXLtIdTV0Jfq6hBQ1ZPgcjdXA3TO9J6ua3Zc6q+XFU0OaqtineUNiYVe9fI8eKg0JfPxOFsxxVfzuqR/Quu6WOktKJxv5DLRJAu29pqPdV7wiapEnM0u5zl2d7kDyp8w609zK35X2eRW9feevX41keFl44TPdGwlYDnSfFYcqfKR7TKHoMsu4JUdstCAvzWv17nPrz44Xbl1WfmNl9zP69afy141NehYN6WZbH9ipXYZUFzHxk+JkNV5u1TbDrDGoNNc5tarY6eJ1S7WoGlxIugSMI8ags6b3aDLLgBlA0rl7UNV6SqXjk2X8GV07MrIpDTt6yK8XafgLsNS1fkuAINXVhQqLuHrjXW3bvZVWXJX5T9l8KkAdMn/LUpfpfS2cq3XHOFTdaxkppiypejcEj6Pji1dHCxXNCqWgFQawTWABJI4lZGHdSVarNexJaKiQilaj6tO4mAx8kZgjizgAKcMsD/5Vg9RvRGRvZgvSHi3QcKjoIRX0BPAPLiPk4t+wsyOwQ6WMJx8KwQ0fA0v0L7fDfcB9LgR6FJdUmaVopXSUIDj6P7JxWOOHbM4x845xM45wIoIHJwTEVno1AThke54QfhMuA/E4Ga8ni7mKkhfZaAcbO/03/0otiwJMwNQRERQCqIdO+cUOydKlDg4EYgAAgisvXgAgIK9o04Q3Lh9XXO8abY9NGM0p3jmkq6UhoG1n5wcjyHHY8SKtC5CMgIIhPjsFKT3ngmDvc+/UNrrpUvRa3WsulyKDjylNBDdPzmOYpskNgGQgTg9ruZKUkFh+B/A/9dfd3de/mIDhJfMeE5t3XQ8A4yOT46j2FqO2ZIHpbxULaQ5U8fPZoAm+AkPz+B/2jn4XOOE36Bj5xDCHc/D4NHHx8nQWo5HDK080po2iBzNYAAikHFY58ypRMqjM4dPZRuxLmnVFmM6ARBdfHqexCObxKPEKeUpn3IIO543KYX3adqo2FaDLvm/twRFU6hC2MHjU7bWJtGAAXhKBblOG0yIrrnUznRSx9BUq9eXJHyySjWtfEOA2Atro4ST5KLnQGQUGQJRXgnPY+Cc5YmV7Dqr3hA1q+HHkws9OcnFLhmCk4RjHg1s4pxSpLSnkQMyrce/mudcBhEoo8zpFab6ail6bOeOwQkSjsGjAUZJ4gCloYk8AhGV2Kot4OXZMDh9cEJ5Z7Ow1yWVlP6Hf4uZ2S0kV/IUFK04usjoJu4ezwA5MCCSgzG5tuLVCa8mcAeWAAWB0DiYCVDrMRXy//i+qmYIoK0AmCv3zcvclGe6GejzG8uK6NI4VAZUXWBCGKByGwZKUwxbOEuTsnLncb1e3AbIkpNlfRgud0alt5CuROBv6FYX5j4vMD7nyjDVsVNRQQ3U5tImQ7IwUanQ51kXkrMe21xZsmCntHwxd6bTS4yXy/CrVwCr6tgoQ8GXPwjIS2dn6nBCVa+vlKKliNKn/C5PEy/r6E5rfkyXUrUQPkkfA2Ul+o2zwhmVnix5Q5tmWhWleoqOtWjOlgnPhTlPNXh9/UlwLkRuKhgB06V9Un6UtTu2SyNTuaKqCUlD88YppXyYP9QZeuxpWs9AyXSUbkbNcXblkioxfbqHmdxexpKE39wZzbfsW/P6qoSneiT8eh27OceWU3Olj1Tk+Tw/GSYJXtLal/T2NunYxrxOq2usXgOcslNcqqJZe3NvKuGpACsb1rHzi1Q01qdzJuMoF1lRN80K2dztSyYJipWopkm+fm+U9PolHTuT8JIrkAs5Xk/cL6XSx4aSYB2ET3KNoYSO3aTe3MaZoMUydMoKU7RAJchIOjXavB47/onFuYTFCYNleheqPL+8ylHOaMomLTtxIxF2EJDqGCJS4ygQF9uYk/EDp7L4/HYu+F5Bj1fNL5S3TifOsRNltGc83+i9wy/c2lcE7ZGa3rsRCJxzVlzvs//eH8XR4GyQACAvVbxWIfwGHSu0IuFBRXWsiBMr8I3v+ab7yq2u5xut5qd/Z2co5mFMhJvPARCXxNGjv3zSH56dD6F9nV4RTIdey5MMKoNyl4fkXOIEXrjrh8++2vVCoxcAz/65dCZWSOY7G9I7u9efg+No+NGf+73PRp4Xlrvx5NCg0aKjLQuZMAx29155MehMz3CLFIyoWdrr7HzlNRddfPDx44d96oSqCcJX07EszAJvJwjC7uvdIDBqWnqq+EivA0D+jW/CXpy+f37e87lW6FLS1zROYS4RE+z5nfDLz/vhOCxF6uSZiAD68Nr3+fE//uQ17XXJrMKIMIuoYD8Idp999TAMPAJE5nvSzNVYUsNmPX6QOnrttXcrQJeNaSCafybrVZsTiQVkumEn7L7e9QOjSCDCRblNaTeVSVLSgAjRFmL98tZZZPwwv/GOdoKw+8rzJjSKABHncmvbNT1IjgCU+cZY6oaedppkds6JlA72D/zxYhVoTRAR4RreTEBL2yTK2h+X9LqsFAHXpcvI58m7rgQgP9jb933TPXy1qwKtiEQgkpTz86asOvaslGuyLsLH/kvwtDZa3/7CrX2lPaWIBBA4RxUgb56IrOMyG6/VdTy49+KbaqksXjvi2l+K5VWDvSjhHUNEaHyQhLCmFEy1VC+uBPRqXqEn7HhVt4R/Wt7TWb5AVcnH9FRDb7JR2g7DaoYuT1EQlHlrwVoJvx1PpT52JsX7Ke/19TqWGuJ2SUWz6bIqPM385KlK+TJuba/k2ZTTo8wNe605RFI2iinoqW7CL+nY5rOblIrnpjL8oo6Nlp1TVMc+CbXU/PFgyQOESrUkzUCvTcc2uKjTFff6VdWx66FTKRa75qdTrnCsU7NtpD5F09jLWSRvGhBpluxSJwdKez1ZK+G3qmMrdlGZ8MmWI3TlcYLMUnRJ6DlL0QVW8Br9LNUmtvY7rU2uXHesxQh2fgTdAAahMe+XkPBVoXNmlxV1rLw5GFlrox4zO+Y1z8gTlD5SWps93+yEv6dteH1RwsfrnU9lqSJv2J696Fu2sZOsYJg853wCQB+G/sHuzv5vt014qR4Ybw56g6gXZyNOcQfHeADoG50bO0e/Kwe95NN95SP9jd7AntnY2jrWA+73H0AfdW7c/GCLaa6whP/6oDc4s/HI1b0Gcr//4KPu7u2bfygA/dHd97agku40hXmRnsPhg78fXX+UG/rxyXP7N2//qnAI5yxFy9dGg/55PLKyFcbJ+XkBwstgcPzhy+HN2/ey00CRUvQbo0H/PLbxFShtZuUlYzrXu0e/XFZzs/8CAg6cIAIixNHNF0QcEWh2SJJmr0aCfNUO4iuDOVeas3ZwCvNS59rO/t47JUrRdy6GNj6PudF4blDIWjs4BcyXjHfN7MF/N03CT1gk3xjGEXpDG7Plqwi59EJsoJWB52EfZuEE5Ah9WAaz4yuNt7XWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrVn7H0W5KY4djpXbAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429591/Arabinizer.user.js
// @updateURL https://update.greasyfork.org/scripts/429591/Arabinizer.meta.js
// ==/UserScript==

(function() {
  var replacements, regex, key, textnodes, node, s;

  replacements = {
    "-": "|",
    "qu": "q͞w",
    "Qu": "Q͞w",
    "QU": "Q͞W",
    "bb": "ḇ",
    "cc": "c̄",
    "dd": "ḏ",
    "ff": "f̱",
    "gg": "ḡ",
    "hh": "ẖ",
    "jj": "j̱",
    "kk": "ḵ",
    "ll": "ḻ",
    "mm": "m̱",
    "nn": "n̄",
    "pp": "p̄",
    "qq": "q̄",
    "rr": "r̄",
    "ss": "s̄",
    "tt": "ṯ",
    "vv": "v̄",
    "ww": "w̄",
    "xx": "x̄",
    "yy": "ȳ",
    "zz": "z̄",
    "BB": "Ḇ",
    "CC": "C̄",
    "DD": "Ḏ",
    "FF": "F̱",
    "GG": "Ḡ",
    "HH": "H̱",
    "JJ": "J̱",
    "KK": "Ḵ",
    "LL": "Ḻ",
    "MM": "M̱",
    "NN": "N̄",
    "PP": "P̄",
    "QQ": "Q̄",
    "RR": "R̄",
    "SS": "S̄",
    "TT": "Ṯ",
    "VV": "V̄",
    "WW": "W̄",
    "XX": "X̄",
    "YY": "Ȳ",
    "ZZ": "Z̄",
    "Bb": "Ḇ",
    "Cc": "C̄",
    "Dd": "Ḏ",
    "Ff": "F̱",
    "Gg": "Ḡ",
    "Hh": "H̱",
    "Jj": "J̱",
    "Kk": "Ḵ",
    "Ll": "Ḻ",
    "Mm": "M̱",
    "Nn": "N̄",
    "Pp": "P̄",
    "Qq": "Q̄",
    "Rr": "R̄",
    "Ss": "S̄",
    "Tt": "Ṯ",
    "Vv": "V̄",
    "Ww": "W̄",
    "Xx": "X̄",
    "Yy": "Ȳ",
    "Zz": "Z̄",
    "AA": "⍨",
    "AE": "~",
    "AI": "~",
    "AO": "~",
    "AU": "~",
    "EA": "~",
    "EE": "⍨",
    "EI": "~",
    "EO": "~",
    "EU": "~",
    "IA": "~",
    "IE": "~",
    "II": "⍨",
    "IO": "~",
    "IU": "~",
    "OA": "~",
    "OE": "~",
    "OI": "~",
    "OO": "⍨",
    "OU": "~",
    "UA": "~",
    "UE": "~",
    "UI": "~",
    "UO": "~",
    "UU": "⍨",

    "Aa": "⍨",
    "Ae": "~",
    "Ai": "~",
    "Ao": "~",
    "Au": "~",
    "Ea": "~",
    "Ee": "⍨",
    "Ei": "~",
    "Eo": "~",
    "Eu": "~",
    "Ia": "~",
    "Ie": "~",
    "Ii": "⍨",
    "Io": "~",
    "Iu": "~",
    "Oa": "~",
    "Oe": "~",
    "Oi": "~",
    "Oo": "⍨",
    "Ou": "~",
    "Ua": "~",
    "Ue": "~",
    "Ui": "~",
    "Uo": "~",
    "Uu": "⍨",

    "aa": "⍨",
    "ae": "~",
    "ai": "~",
    "ao": "~",
    "au": "~",
    "ea": "~",
    "ee": "⍨",
    "ei": "~",
    "eo": "~",
    "eu": "~",
    "ia": "~",
    "ie": "~",
    "ii": "⍨",
    "io": "~",
    "iu": "~",
    "oa": "~",
    "oe": "~",
    "oi": "~",
    "oo": "⍨",
    "ou": "~",
    "ua": "~",
    "ue": "~",
    "ui": "~",
    "uo": "~",
    "uu": "⍨",

    "A": "`",
    "E": "`",
    "I": "`",
    "O": "`",
    "U": "`",
    " a": " `",
    " e": " `",
    " i": " `",
    " o": " `",
    " u": " `",
    "a ": "- ",
    "e ": "- ",
    "i ": "- ",
    "o ": "- ",
    "u ": "- ",

    "AY": "-y",
    "EY": "-y",
    "IY": "-y",
    "OY": "-y",
    "UY": "-y",

    "Ay": "-y",
    "Ey": "-y",
    "Iy": "-y",
    "Oy": "-y",
    "Uy": "-y",

    "ay": "-y",
    "ey": "-y",
    "iy": "-y",
    "oy": "-y",
    "uy": "-y",

    "AR": "-r",
    "ER": "-r",
    "IR": "-r",
    "OR": "-r",
    "UR": "-r",

    "Ar": "-r",
    "Er": "-r",
    "Ir": "-r",
    "Or": "-r",
    "Ur": "-r",

    "ar": "-r",
    "er": "-r",
    "ir": "-r",
    "or": "-r",
    "ur": "-r",


    "a": "",
    "e": "",
    "i": "",
    "o": "",
    "u": "",
    };

regex = {};
for (key in replacements) {
    regex[key] = new RegExp(key, 'g');
}

textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < textnodes.snapshotLength; i++) {
    node = textnodes.snapshotItem(i);
    s = node.data;
    for (key in replacements) {
        s = s.replace(regex[key], replacements[key]);
    }
    node.data = s;
}

})();