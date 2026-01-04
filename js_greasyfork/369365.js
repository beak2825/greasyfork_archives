// ==UserScript==
// @name         划词搜索（手机版）()
// @version      1.1
// @namespace    http://tampermonkey.net/
// @description  划词搜索，快速选择搜索引擎，一键搜索，跳转百度，谷歌，必应等。注：第一个图标为打开网址的按钮，仅当选中文本为链接时可用。
// @author       Sirius
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @run-at document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/369365/%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%EF%BC%88%E6%89%8B%E6%9C%BA%E7%89%88%EF%BC%89%28%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369365/%E5%88%92%E8%AF%8D%E6%90%9C%E7%B4%A2%EF%BC%88%E6%89%8B%E6%9C%BA%E7%89%88%EF%BC%89%28%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var keyword = {
        beforePopup: function (popup) {
            var text = window.getSelection().toString().trim();
            GM_setValue('search', text);
            popup(text);
        },
        beforeCustom: function (custom) {
            var text = GM_getValue('search');
            GM_setValue('search', '');
            custom(text);
        },

    };
    var iconArray = [
        {
            name: '打开',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAjlJREFUSEvtlruuqUEUx//ut4bOZUsEjUbrEi+gEOLyBN5Aoab0EhKVitAqdKLRSEgkmydACFvcfceM+eJ89oedfXBOss+vmZk1M2vNmpm1ZiTcEfwFpKx8OT/P8EPOOJVKIZ/PQ6vVMskZon632+H9/R16vZ5JATkrP7FcLpHNZtHv9yGRSJj0zHQ6RaFQgNlsxnw+h0wmg1R62kAy3mAwQKFQ0PZ4PEan00EgEKBtgqjHxKjL5aIKttstkwoZjUbodrtwOBy0vVqt6HiyALlcjmg0Sr0kxieTCYrFIrxeLx1LEPU4k8lQJW63G+l0miq9ZL1ew2QysRagVqtZDYjFYtRDsgidTke3+xPE40vi8ThnsVi4RqPBJF8nHA5zx13gjEYjNxgMuGAwyL29vXHNZpONOCF6q/kz3Ww2tPwqkUiEerpYLFAul2G32/Hx8cF6hdwMp+PCWO0+vFFiqFQqwefzsR5xHhLHyWQS7XabelqtVuH3+1kPsN/vBSXPQwwfDgfMZjNUKhV4PB4mPWG1WjEcDmGz2ZiEcTpqIYlEgl6uer3OJH/GMSpY7cxDPL6HSqVitTNPM1yr1Wj2CoVCTCLkaYZJxtJoNILE8jtP3WqSu/mccMlLzliMf9PwtW36Cvfmiho+hhktlUolLb8DP5fXdYnos0iSe6vVQi6Xu/os3oLcZDKX3Gz+vb7k2x+BexCjRHWv1xMNqat/LuIl+RBc+/rcgqh0Op10/rU4/v+hfxk/zTDwCyMemuJBYiocAAAAAElFTkSuQmCC',
            host: [''],
            popup: function (text) {
                if(text.indexOf("http://")==0||text.indexOf("https://")==0)
                window.open(text, "_blank");
                else window.open("http://"+text, "_blank");
            }
        },
        {

            name: '必应',
            image: 'data:image/png;base64,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',
            host: ['cn.bing.com'],
            popup: function (text) {
                open('https://www.bing.com/search?q=' + encodeURIComponent(text));
            }
        },
        {
            name: '谷歌',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAARBSURBVEhL7ZVbaBxVGMf/c9vJ7qZWm91tgmgasUXU0igNVB+0WF+kXmoqfRMFrX0s9KGlWhAEX3wwVEQffFAQsdqIVSlqRYNorLRFWluo2lDUSmrVbC57yc7Ozf83M9tsJrub1UB98Qdnzsy5fP/zfec7ZxSf4D9Ajeorzv/CV4x/lFz26ZMof3AQ9skTcH8fBzhT6+5Bon89klu2wVjbH41cnLaE3b/+wPTO7bAv/Aw1vQwwNM5kkamOw1KFVyhC7+3D1S+/Di2TjWY2Z1Fh69g3mN61A+o1XfA1DYriB3pwPQqzKGrY5inwSwWgaiE3eiac3IKWwva5HzH5+FZo2ZXwFRr2vNC47UDNraTTGtzfLjACOhTDZL+L7GfHuJDIQAtaCv95751Q0h1MQRU+Q+qXZrBs1z4k7x+MRoSUh99C8ZUh5D4/TottqJKmws7pFzC19116sQLQbca8gszhr6DoejRiaTQX/joDJeGg8OZNqIxayLx3EHrfjVHv0mko7NsTcEYobGahpMqwTg0g9eRI1DvHayNVpE3ufWRCnswz5gNzzwUyVynY3G8EfXEaC09+CefERnqc5d7OQFu9G+r1z0W9c9yyp4gsT5dYCIxElqRyKLw8peCTPemwMUbjm8st8iFJIhZpATlpXUDaBFIJ1h1K4HknS6r2zpz0Gu9iQGNho4sPmeQzoVWo1g9Bc5x80cNkyUe+xFrey364XE71WGQhcWprCULt8XyKQA3ft+EcScAwl/Orip0zd2P/gx+HnXX8dNENLjGxpfIYmdzOh18sByG2HB+39WoYejQZDo6QnVU4tqHHimLA6FyFCVfFxolBHC4kMTz2adQ7x5oeDX05DTewrMqqOPWrC40WJbksnsANq7mqGLWUuiwcz7HzvS9h/fhdqNJKj9mBfUeHMDr+XdS7kIsTwLPDFveYH4xzpepjcGB+RtdrXM5ql/mv8Qqs574PtyM/O4WEZnASb7LZPDZddweeunUb1natYWRUjE3/gnfG3seBozaundrNC6aCQsXB5tsNPPMQs68Ol/e7JiEhLYVd3r3r3t6CtJ6EoercSx+WW0XZqcD2GEui8y9laiY6TBuq3Q3j3H6YuoYje+fvrVCvMe8cO7yP9diVWKyWsenQY5h1LHQaKc5gI2co8sLalxuDePxTTdt5rEhkMLr1wILzErc9T1hWFGRcXYbXeP74q3jj7CEk6HlCTXBMeFQkKhWvCtt18MTNj+DpgR1Bez1yakSmPqLzhAVZWXB2G4gLH53/At9e+h7jpUuB8z3pHDZ0r8MDffeEA2KIqJR4JBcICzb/t5IEzcTbRQRdFqPBH62hsCCeS5dhNL7kF8O27WDb4p7WaCosSFeVBjR63sxAHJsLFk8TXLAIN6OlcA0ZIh6EKME21IxKn4STL8G3RKiVYI22hONI9su0mkD8/LfDvxJeOsDfm07+Nc7On9MAAAAASUVORK5CYII=',
            host: ['www.google.com'],
            popup: function (text) {
                open('https://www.google.com/search?q=' + encodeURIComponent(text));
            }
        },
        {
            name: '百度',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAARRSURBVEhLzZbri5ZVFMX7C4KIMrtoWZalVnaP7h+K8FMkUhB96EJ0gyjUTC0dzczsYpk0mN2dRMpRKq0ou4mYTuIIWiZW5niZspxMs1HT1fq1zzPzvPd3IKgFh/d5zz7nrLP3Xvucc5j+I/z/iZd/L90zT5r+aeoog7370kcdqIv4sw3ScWOkAROlPuOkm15JhoS2DmnoTOmsx6SJi1NnDdRFzKKDHpXOfVw6Z4p07EPSmi1h290pnTlZOsObgpiNTf4gbNVQFzFEEEJMO3WCQ/5J2EY2x//MNsTjiE4t1E2cLUw7rUF6NhEPdCTOtqd5e5+x0rrtYa+Euoj7Onx5j/vbw8alYSuOBt9HjQpbNZQQz18tDZvlEM7vVuktr4eXLEooez0odewN20XTnFvnOCMe4HG3zQlbNRQQN7dKve3BwEmRt34PS4fc3/FHLIrnJziML3wR4wGe4/XpFlf/8RaZ5yK4WiggvmaGNDipl4aX978dtj1ebOEaqbUt/udB/91zpQmLgrTzQETpekfu5lel9e1pYA5dxL/skU7xjvP5QjS0nuKq6aEDnKD2aW07kzGhi3j7riiDjDQjpkaL0bk/6rjdc4qxcUeQ5h0gbaMWpAEJXcS7/ozcDsmVBqRXevd5jHs3DhMWw5MbX5L+OpiMRsumsOWJGU/Y8yjI8b0+i09+JJSLt0Rg9rJkNG63Wk+y4LBlCkcHVzydBhgtP5YnHvZiGpBQQHzIEh4+2+TONRuY9H4yGE0rQ9VEhJYtzC+hvaMpxq3bVqoVFH+XxZdHAXElkM9+3ghn8XlTpfPdisn7OhKz0qFymSPA5kkdpMc7ciudgjxqEi/dGJMhhXy1y2nH7shv3iu+qfHFa2PemHd8kLzh9DgSS76NvjyqEhNeckrOOByOHCmt2iztpPTcR34RIMRZvtHFvFVpgSqoSDzWO8YDvBy9UFrgU23OCpP6FNv2W5DM/DzUSr1e8IQ09cPIZa/R3bdXJZQlbvBlfqI9pWWh2+LLfu3W+N7sw2CQ8wem+O5FXJcnZS9zatgsc3mxVEIJ8YafYyLCGJ5KYG5LhPCIEZFfPObiBw0+JiG+9Kn4//E3URH/CM5V8PLy6C9GCfEzDhELIaiG96Lvvrfi1iH0Wagz4vEeQ/kUE5N38n/Jk9FfjBJiwgwJobzVqgQs3tt5O/yBbo+zUFPrx9iGhyBPzEFzoXNfDiXEr30ZNchCKDo73HnwLUr5/un38D5Dq+v86/TiWLK+m5h7+mLf1+VQQsxlQfmwW9pgT270/bvVXmbervjBm/LiN/ic5qRiI8xr92+Tlc98iKn1O99MCxehhBhQJpw2nLE0xIa4CCnPGhpRweuj/RohDXwjpuycZh4R+863VTmUJQbNfgJd1yhd/Vw8EPjFwxF+VVLP2KntaR+F+qllNsdDj01f+7z0lS+MSqhI3FMc9AXD1brpV2mfXyC18K8R9wzS35XpXuCn7a8LAAAAAElFTkSuQmCC',
            host: ['m.baidu.com'],
            popup: function (text) {
                open('https://m.baidu.com/ssid=c4dfc7e0b9fb73737823/s?word=' + encodeURIComponent(text));
            }
        },
         {
            name: '知乎',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAQ+SURBVEhLxVdbbFRVFL1qaiml+KINMUQqfkiELxON1iZG/TAxJn7xZTT6Y9IYFIIRa7XyECrlWaVBW0RTDKgRQ1GJqQpEIm9LrGJIBaNWneftdB7tMO3MLNc6t7fMTKdlUqfhpCvTzt7nrLPfp9bxvgSqNvpQvj6A2W9NL8QhLnFaVc0+lK3LrzgdEJc4rYksrWjyo2y9A/2eT2eqEKeVTzBLRMSd7wSxuDWImzc4F8mnO1WMI65oCmDGOj9q2238+GcCHacGMX+LbjnNxCKo2uDHThJqLfl4AFaDF9ZqxiUHM6lbTk/kk+VCupk844ivf9OPB9r70esdRngohe0nBvHC11Gs6MpGw6Eobm0OoJJhaDwcGyfPxOuUV7cEs8iziBXHUhI/uy9MW9PG4snWUx+FUL0pMPrX5OvBD0PGqLzEutG8zUHsPiM3p7G3J466LyM4+sew2XzgXBz130SxklhFK+7dYWPBZof473ASz30RybK07qsIznpGjLxmV39+4gqiZK0f9+3sx2A8hQv+EdS29cNa6cHbx5x4v7g/jJI1flzLmF23hqD+wq1BI+v+dxjWyzm58IoXe3++ZOQTEitJqhizlqMxo1jPuFbQA9YbPrSdHjLfLTsQYZk55absL2P2u8Q93hFYr/nGDjaHN/rw2bkCiOdtCuIZZvFjHSFU8hJqHiJ+v9shrvs8zMuMEnNPUYjdBqFmMZMHunUr4o6zDvHTn4YxizLpFo1YkCWKm/UqY+ViuQftZxzimtGYW/WjMhIVwWLHgiV7Bqh25VLSOtJ7CXPoGa0pE6uUFmwLouvXuFEsbKVxAz2k9b9cLXLFdMzNLIfZLJsjFxJm8/yt3KCSceV0eVFinAspPsK6vhgYgSeUwl3bbfOdwlLU5MqFxWZR1xnGUCKNY78n8OQnYdOblfFFq+NcKMNLGb/WE05G9/qT5rPpu5hpLCKfFuISKtW8Z6PnH/bpdBo7jg+ib8AhX9oZMW1Tc9slNi2TOaE8EcE1hbbMTKiLlfPQtbROq/uvBO4gwVK6PZViqfHn0Q9Y06svE3ujKTy+J4Qbue8hkixjyy1oSLhQ7DQsHqbibxwUWo3fRs1TaAZjvu175zInL/KlSNcuYgm6yxdJoplTy92XuSYdi4JcfDsP6/zFqefznmHc32ab7+XaOdTpOh9HkGNQxHPZ0xsOxdB60plgWnY0iS0/xIzVBT0E9AiYuzGAXaedQ9LJNJZzHiuZzAOQOrrAQj4CW3iYsl5JpiS6+10bYBhO8Z32xO6Q8ZC16vKIzCQVxoglkKX7fnKyuM9O4qWDEVTyIppSmZvkstv4AFAuuHurGevn90ewqNVGGeW5RLkYI5ZFt9Bt99CttYzvYh6gSaWSUbPI3CS4pII72W4iSqWfIZsIWQ96kSuOcrk+9Xc+0nwQmRuOK8E86K/avzBX55+2BP4DcovUl93kjrAAAAAASUVORK5CYII=',
            host: ['www.zhihu.com'],
            popup: function (text) {
                open('https://www.zhihu.com/search?type=content&q=' + encodeURIComponent(text));
            }
        },
        {
            name: '豆瓣',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAL9SURBVEhLxVdbSBRRGD4VpakZUeRS0UMvBkIFXehCEhlG+FJY9NZLRhQlZVphyRJ2o7LU3cBK80EIigKJHqzoroIRQRRRkNlKJJqW91gIv/7vOGMzzrRUs1s/fOzZf77Lzu6Zc86qxtBTxBemQBUkQx2YEltIBrOYqeIKfVD5Se7EWECydKbtTvdPhtqXAJU3MbqgJ73NHGZaQyfI17CgNF1jfunKqMD0o7ctfGQgn2reuRWIVdFb37lbcNrZZQYt+kVv9+D8SUgpTkV5/QUEGysRaLgYFdCLnvRmhjPYCFe5Y6B2KqgcwVaPoAe96GkNJWxviPxEpJ5ZgpLHQZz3cOfU0oNe9HTkOBp747Du8ibjl/Fe9KKnI8fRENKayg3oD/dr4UB4EA+an+Dai1rceHkzIsghlxoWPej1V8GhL61YW7URiUUzMfXInIggh1xqWJ6C33e1YHEgA2rP+OEJEgnCIZcalqfglq4PWBrMHF76RnNHQzjkUsPyFPyusxlpJcuhdshjsVsei0gQDrnUsDwFdw/2oub5VRy/X4JTD8sighxyqWH9cXBmVTbC38Na7KXoQa/fC5bfKb0iC6/b36D7Ww8wZLhItfd14FNPG9p6221gj9dGSjTU0oNervPD0SBI3Ka0qPXrR8NrCAvLV+m9dNzBaTawx2vksKjRgeLxy0np2iTkpOA7Ohd1b+9pM1bO9dzhTZwnFr5axrxmFjXURjzZuDYJbtp58SirrzDsgNpXt/QioQrkmTV5MmaP18yihlrbxj8atjdcBHLH/sR2heyaLejo+6wNB8IDSPbPhtrFHcfgyJg9XmORSw21Ni96W7OsoT7ZM08/CsB/96RGYV0xqp9dQWd/lzZlcec5fPsY/HdOaHDMnlnkUkOt6UNPetvCRwYyCRaVrzbk0S962yaaNZjrbKxKr/euwTIzk4pmIat6MzIurY8q6Elv/RQ4go1wvcrEAtZQwtH4F2Dm//kLI4f7hlCTnPKnO7+KWEAyEg7NQH2oCT8Abq/6YUUWn/EAAAAASUVORK5CYII=',
            host: ['m.douban.com'],
            popup: function (text) {
                open('https://m.douban.com/search/?query=' + encodeURIComponent(text));
            }
        },
        {
            name: '胖鸟',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAASzSURBVEhLpVdrbxRVGN7/4gc1UGnRWsEgYLygJgYFjIYYxcRPxgtK0EisHzQxEmNMMPESGlpKaVGKQEWxFy2XqljatGhbEaxcgjt7v3e7u915fJ8zc9rZ2WmYrSd5MrNnznmf817PuwHIGAkWseV4FHceMHDXgRAaO0Ly5Luh5qx5Y35ez7mh17hBmSvbDWz9LoaJaImUCPxmFNAkH+vaKkkpqEF+1++XTdwov4kGEcC5+v18OmEJ1wdwH4Kyl7cFsaYrjIlYEYFNoilJnYso/LFvIvh4JI32iSz2XsjgqZ4olrUaeLE3jlaZ2/dHJVoELw8ksILkAi9yYllrENtOxhCgFlpTjTtEAxIYubIyC8fxyzNoHkrhlxuz9kz1GA0V8P65NF7qj+OegyFb+0rZ2uwB9weCxNtOxjGdnLNFVo5Yvozef2bQfzWPAUF8duGAHH/FS3jtpwRW2eRu+eQMuCeJxYinUyWMhYr4fDyj3MG11Gzv71k1fy1tBQ7HkFjmke6okuWWT9REvGc0gwcPh3HfIQkuIVaBJljdGcKG7jBa5AB6/Clav/LjgsndHD6JTSTEvDtPJ9U3knGdFnhvl+yRAG3+OYmUMruJOXmcup7HE8ei8+ud8EU8Z5r4bCyDBw5HhMxKN2KFrNs+mESf+Pm572NY/5VoPZ5T6zno602SDbdLNqhAc3D4Iy6beH1QUkVyVacIBfEQjGSOE9MzqGsN4Y3+FEq2oUj8al8cTx+NYK1YRR3Y5vBN/KaYeWV7JTELTN+VvFrDgKsTzXYOpFG0iWdLJq4mSvjoXAprJA6cWi+ZmE8G10bRZtfZBNaJmZWfz6SUf/XolYM91B1BncjUe4klExN8t0wu5VQOQQu892sKZdvHDLJJKY+fSAXceCSi1uu6UYOP4xU+1rCEWeSs1+8OJeaJMwUTRyaz2PFDDA+LjxtrJRZXYfdwWhV45Sd7swZ/c37toTA+HcvOR/XFWAlP9kRwq/jeKs0Ce48vYj0+FPJ6MbcS0mFrLu9WFTNUgXGOYWMWvIR4ezlJiZqIdw9n0CSV6G5ZQzL6lSDp6k5LWz3OG0UhjYh7glUWImoivpKaw4VIAV+MZ+1AC6mLgFfieKSI6xm93sTZGwU8KgHFSPfi8EnMEmjCtH0XzJbRPpVDp6DrYg5hx/XJHL6ULOGdoaSq6XSLF4cvYkbp4LU8vpSGYEQ6Fq/BI01ESmibzOHtM0klx6tGa/gittIpgVtagnLJJ9Dzdx7HpDHQYJNw9FIeO04lcNu+oKrhKvg8fKvhm5g3UwPzWL4zuNx7OEcyK92I6jVO+CbWlUtXKS+w1/KS54VFiV9YhJjaeO2pFZ7EyyUFnpUe+LLcLJp4u/RQXiVzqahq9mjKRsnNt04n8K+dl4zqPaNp3P81G4Gb++9m4P6q9pYpsFnK3HlX2hTkrmuW3NQdiFNQLSAX4yFAEmdDz7r6zLdRTMWLirAohKU5q3B8ID3z/yVWDb20SYERaV2aOsLq7wVPQ1OuOhjG43LBb+mJYbP0TATf14upmTJLIaZskq6TG2xSlFJ/2sbCRWw9EVu4ugS8BFgInPCbo25wPeU9L5pOyVUJAP8Bkzq6lznKDy0AAAAASUVORK5CYII=',
            host: ['www.pniao.com'],
            popup: function (text) {
                open('http://www.pniao.com/Mov/so/' + encodeURIComponent(text));
            }
        }


    ], hostCustomMap = {};
    iconArray.forEach(function (obj) {
        obj.host.forEach(function (host) {// 赋值DOM加载后的自定义方法Map
            hostCustomMap[host] = obj.custom;
        });
    });
    var text = GM_getValue('search');
    if (text && window.location.host in hostCustomMap) {
        keyword.beforeCustom(hostCustomMap[window.location.host]);
    }
    var icon = document.createElement('div');
    iconArray.forEach(function (obj) {
        var img = document.createElement('img');
        img.setAttribute('src', obj.image);
        img.setAttribute('alt', obj.name);
        img.setAttribute('title', obj.name);
        img.addEventListener('mouseup', function () {
                keyword.beforePopup(obj.popup);
        });
        img.setAttribute('style', '' +
            'cursor:pointer!important;' +
            'display:inline-block!important;' +
            'width:22px!important;' +
            'height:22px!important;' +
            'border:0!important;' +
            'background-color:rgba(255,255,255,1)!important;' +
            'padding:0!important;' +
            'margin:0!important;' +
            'margin-right:5px!important;' +
            '');
        icon.appendChild(img);
    });
    icon.setAttribute('style', '' +
        'display:none!important;' +
        'position:absolute!important;' +
        'padding:0!important;' +
        'margin:0!important;' +
        'font-size:13px!important;' +
        'text-align:left!important;' +
        'border:0!important;' +
        'background:transparent!important;' +
        'z-index:2147483647!important;' +
        '');
    // 添加到 DOM
    document.documentElement.appendChild(icon);
    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
        }
    });
    // 选中变化事件：
    document.addEventListener("selectionchange", function () {
        if (!window.getSelection().toString().trim()) {
            icon.style.display = 'none';
        }
    });
    // 鼠标事件
    document.addEventListener('mouseup', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) {
            e.preventDefault();
            return;
        }
        var text = window.getSelection().toString().trim();
        if (text && icon.style.display == 'none') {
            icon.style.top = e.pageY +40 + 'px';
            if(e.pageX -70<10)
                icon.style.left='10px';
            else
                icon.style.left = e.pageX -70 + 'px';
            icon.style.display = 'block';
        } else if (!text) {
            icon.style.display = 'none';
        }
    });

    /*检查长按屏幕*/
     var timer;
     document.addEventListener('touchstart', function (e) {
          timer = new Date().getTime();
     },false);
    document.addEventListener('touchend', function (e) {
          timer = new Date().getTime()-timer;
          if (timer > 1000){
               var text = window.getSelection().toString().trim();
              if (text && icon.style.display == 'none') {
                  icon.style.top = e.changedTouches[0].pageY +40 + 'px';
                  if(e.changedTouches[0].pageX - 70<10)
                      icon.style.left='10px';
                  else
                      icon.style.left = e.changedTouches[0].pageX - 70 + 'px';
                  icon.style.display = 'block';
             }else if (!text) {
            icon.style.display = 'none';
        }
          }
     },false);

    /**触发事件*/
    function tiggerEvent(el, type) {
        if ('createEvent' in document) {// modern browsers, IE9+
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);// event.initEvent(type, bubbles, cancelable);
            el.dispatchEvent(e);
        } else {// IE 8
            e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }
    }

    /**在新标签页中打开*/
    function open(url) {
        var win;
            win = window.open(url);
        if (window.focus) {
            win.focus();
        }
        return win;
    }

})();