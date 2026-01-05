// ==UserScript==
// @name         Torrent Highlighter
// @namespace    http://what/
// @description  Highlight entries based on name and/or change the category icons on torrent sites
// @version      1.1.68
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAXV0lEQVR42uWaCTiWad/GfV800zRf07RN26gIhSxlKS1UlpAkbZSMIYVQthJFZWlB9l1CEqkkpYzSZt+X7ITIvnse6i3n938w3zvv+73LLNVU73Uc53E9nuc47vs4f9f5v5b7xsb2JzYgZhxSZNjZ/tMagK/xZiioJ/Mac7BYYmioclVk93OZyf8Z5js7J+F1X+rwqz7U2K4CM38BhsoWY6hSKg9l66d+5iPf9c3bgZYMMFvRmxaNcp0pBIATQ6XzMVTOj6GqVQVokpn2eZrvKfoWPc+z0FMD9NaixmYtqnSngVFA5svmkbgJwhIMVksX9VfLz/i8zL8omYK24hy0FgJtheh7Eomy3dNQqz8DjEJWCSwYATBYzovBShEM1qwrQe2m7z4L830VKdNQn5mP+lSg4SnQmI7aoxtQpf0dGgxmgVnIPWaeB4MVfGBW8oNZJYbBOvlSRt2WWZ/2yFc9no6ap4WoeghUPQBqHmLgUQRKt89Erc5svDSaSwlYSOZJFbxkfjFJAMxqYTBrlhMEpXJGw87Zn6b54uTv3j57WILSZKD0J6A8eQTCcxt1VGrMRr3e92g14QSjhG/UfMWiUfNVSwiACBg1yzDwfDUY9aqVzMZdcz8p84ycu7NQlFyKgntA4V2giPpnSWA+ikKJ2hzUan2Ppv3z0GG2gACwRv3vzS/FQK04AVhBWoeBF+rVXU1anJ/GyOclzUbOvXJk3QaybgE5CUDenREQ9cd2o2Lb96j/YT5ajLjQZbEQA6Us41T31WPmq8l8Dcu8JEkK/XXS6K9XRH+TZu1gl+68j9t8xp25SL1diSdxwJMbQCr1GfFAdgKGHsbgmco81OzkRJMuFzpMFqLPipcAsIwLUs0L/2Lkfza/mszLoK9eDn0vVNH3UrtusOXAgo/T/JN4zuGUuGokxwLJMcCDq8Cja8BTApEej0Z7XVRuptHfNR+t+tzoOsiDgcO8YJQL07JHk16tKBi1YqPm6yj69WPmG2TR+0IBvY0q6G3ajr6WffU9rcbcH5f5xBvzce9qLRIuAwmRQCL1966Mgki5htfUlylzoUZ9Hpr2LECHAY2+GZm34gOjQhTM5yyJgVEnSSLzdavQ3yBDWk8jzzKvTOZV0ftyK3qbtdDbavKit/fIwo/DfEIkF+Ij63DtInAtFLhO/c2IURB3WRCuovnEflQqz0X9dhp9HW50G9HoswBY8mGgchmYdctotifz9StIq2nSW4v+F+tJCuhrVCLzm8i8OpnfgZ7m3ehp3YuedsvG9nZbvj/XfEzEwuHY0AZEBQCX/YGoQCA6GLhKIG6EA7ci8eZ2FMqVeFCryomXGvPRocuNPgLAoBJgmhOIKgkwGlgi8w2ryDzL+Ab0Nyqir2kjGWeZ30Lmt5N5TXS37EF3qx662ozR1W77sqPj1OI/x/yVQF5cDmjERU8g1AO46AWE+wCXWCCCxiBEoPWEMarl5+CFGifaNOejhwAwDMj8wcUYtBSiGX8dmC+kwXhBa37jegw0KWPg5Waa8LaQaNRfbhsd+RYy30rm234k8/vQ2W6Mzg4rdHU6tHR2ugl8WPOXAxYNh3q/RIAL4HcO8Kc+yA0IdicQ3kAEC0Iw3l6LQKXiItQpzEEzAeikBPT/SOZNRIcHj6y88uq4jDqzfuu2gabNsczmzcOMl6pgUJ0PtOxAPxnub9mNPjLd26JNsddBT5suAdBHV4cR6SDJCp1dx9HZ49ra0uW15MOYv+DJPxzg1gxPJ8DdAfAgsT77nCEYLBAEIZSVhEB02JmiZs1MNCrMRgetAH27uME0XPqaabVm199ftyB9/Y7KIqVX/S1aGCDT/WS4nwz3teujt30/yRDd7Qco9iZj5i3IvDU6uuzQ0e1MEHzaurtDhN+vea/TS0itOGsHnD4GnDmOkc8u9oDbKQLhTBBcKQmeGCYANQqCqF/zHVoJQPeWBWDqir5imq5W/2fXj45eqBJ7g3coJ1uOZvp96G83IADG6CXDPR3m6OmyRHfnYYq9NekoAThGAE6OAGjvcUd7b3BHW3eY6Psx73pSeNjZrh12VsAxc5IFYGcJ2NPfJ44AjjYE4wRwnpWGc+i2NUGtxHQ0Sc9Ep/I8DGiJvBoyXK367+4TG8erFBY1a9A3Yjrup8qhs80cfZ1W6O06it7uY+jptkd39yl0dTuis9tpzLwLmWcB8EN7f3hnOyNm2bs173h06bDdkQ5YGgNmhqMyNwIsDgCWJsCRg4CtxSgIp+MYdj+NOnkhNCyfgTZZiv5OocEh/dXKv/Z+cXF8CpdiZzHdQr/EyaBJuJ6iiJctx8n8KfT0OKO79yzJDZ1kurPXg4yT+jzR1ueH1r4LaB+40tXBiBd/N+ZtrMRgdbALRnuB/T+OSRcwIBnqAQf0gYMExILgHD5EyThMm5z9qFs6Fc1r5qBHXYg58MOqDb/1vnEJPLKRcbMZ7pe+xPHgcTDzm4iwe4poeOmMHjLe3eeFrn5fdPYHoKM/kAAEoo361v4QUgTaBq71tPTeXP7HzFuYSsLYoBs/7gH27CJpAtrU/8DSbkBHC9D7YRSKEYEwJRCHzfBCXhSNUjTxqQoyBvYsl/2997/10yKZqPjZA55XJsA+bBwOBY6DnvcE+CRsQFWjK7r7g9A1cAGdA2HoGIig+NOy2x+O1oFLpGi0MuJ7W5n3pH6feSOjFdDX7YHmDmC7+qh2bB3Vzm2ABon1m5bmL0DogbFPG/USs9C2UXCgW1Ny7R9NYEIy7+qoO3P6vGMn4GTkOJhfJAgB46DhNR6n4+RRXO+BTkYk6Qo6GDFoZ1wl81fRMhCDFsYNUmJfGzNl1W8zr6+/alh7dx+2qAGbVABVljYBm1lSBdRI6vTbNhYUFoidBIJSoauDZiVJNCsK9LVtl1rzruagmw/4Vl65O6fX58YEOMSMg+WlcdC/wA5Nf3aoenDA5upaZNV4opN5HR3MOLQxb7FGn8yzdBstzOT+9sHH0r/OvI6O9LDGzn5sVAY2KJA2AIokJcVRKSth5LdNLBibCcQWAsFKxE4MaWuiUY6/t3WL2Mp3vQrdTFm8PDp5bo/Pra/geG0crK6wY38EO3aFsGMzgZA7Pw6mkavwqMIDHYN30c68RyCS0EpqZv6E1sHHA+2DGf86kX/R0lo3vH3rwIhxWdlRycmNSl5+VAr0myKB2LjxrxC2UhJ27ULnNvnuFvXlku9rHxKfyisenfJ9l+8dghDHjsOx7DAgELvD2aEWzA4FX3asdhsHnYviSCxxQ/vgQ7QNPiLzj9AyolRGy2DWP56TsGePLNTVGSMm16//q34J4mcASkp/BaCmNjL6b/brd73cJCH2vnei8emLl0Y/+r7T595EOCYQBAJhEMuBPZc5oB7GgQ1B7JD2YYe4KzvUA5fgWp4L2obS0UpqGcygPpvZOpSr8LfmtXfJY8sW5ojJtWtHtW7dqH4JggWAVRI/A1BVHY2/nt4gLCxWfKizyO0sfpGop3O7vJMnwDGRINwiCDcIwlUObCUQihc5IBPIDkkvDgi7EhRfPkRkO6N5MButr3JJhYNtQyWjSzM0NKZh29buEYPSMoDMmH4J4u8BKNMcoKIyGn+KPq0Y1h/6NBqfwaNxKXUqPB+Mh0MSQbjDAcNbHNC+MR5bYzigFEkQQjmwPIAgeHJgkQs7VnktgH+GPRqZeWh/XdbTg/pvWdG3HBnRNWtGJS09qhEQYxB+CYBV/8pjk+AWmgB1dd/i4MEP/mbXDmz/fTNrTteFp1/A4xEHTt3ngFUSQSAQ2vEE4fp4KBEImUvjsTyEAyJ+BIFWDK5zHFjqPgfe6SdR3PF0C1uDR6BDf2Qc3ly9izdX7uBN5G28CUvAmwvxeBNE3/vfwBuf63jjSXInuZFc6TsX0rk4vPVOfIUYjPsznklopkW/UMkIh3JeBDaWRGJj+WUoV0ZBuYr6qkgoV9N31ZewsYZ+rw6HSnUYNlVfxGaSVm0kjGqubGTLOOoolGZq+7bohDt6bqQAKUVAUgFwJxe4mQ1cywKiM+h4m05n/TQ66aUCASS/p3ToIQXQdxcz1T60+Q2Pc4WkU7OGxTMzIFmYjVUVeZB+no+19fmQfZEPhaY8KDbnYmNrNlTbs7ClMxPbujKwsycd2r1pODSQ02GHkq9HLpZn62ydfuAoUrRMkGPhhNbIRAw/LAHuFQK38oDrOcAVAhFBIEIJRCAB8CXz3qMaDsxoRnjmB3tcTSeOCRtSizLFHmZCJCMLYgW5WF5egJVVhVhTWwCZugKsb8iHXGMeNrzMhXJLDlTasqDWkYWdXZnY15vz2oJRoPI3Fy20cTqabWIz/HjPQSRvM8QTPRvU+1/D22QCkUipiMsHYgjEJQJxIX00BSwAHiTPVAz7Z9YjJIvrfZunM+dEvY7+B6KJmRC8n4klabkQzS+A+LMiSJYXQ6qyCKtrCikNBVj3izQoURrUWnPwQ0f+K5OOgn+c2CJb58O5pseGn2ofQsq2A7inuh/3th9C+ZlwvL5DZRFPIGIJRCSVxoVMgkAgvAjEeYJwniD4ZjQgIOe9PbOn8+Yko9d4uja9EjzxmeBLzoZAaj6EcoogUlgMsZISSJQVY0VFMVZVj6ZhbR1BoDQoNeVDo6VoaG974aZ/eZNnx53N8wlCmrYZHhKEpE0GuKWgjxuKBsiz8QfjGpm/TqURRaVxkT4HUFl40TzgRiBc0zDslfECPrnv/Jn9EeBbIyaytNqYmB+VjgU3s7AwKReLHhdAILMES/JKIVzwDEuLn1EaSqgkiqkkRtMgW1eIbU3Fg7rNxb/umUSxzemD+abHh9P3mCNlqzHubTJEvPw+xMrsReQqPTwyPo+uCBr1aEpFOIEIorLwJhBuBOIcyT2jER75PO9s5Jsx3bAH+Vq9gNT9KsyOzADnjRwsuJuPhQ+LsCjtGfizyiCYUwqh/FKIFj7DMkqDZFkJpCtLoFpXytzdUP7bnkmU2Zw5kG98fDhNyxwP1I2RuNEQN+X2I1paH+Er9iJQTBe39jij0S+ZSoISEUKrhi+BcEsfheCW1TTknv2HX1wYtmHmvtbhkl3tdApvGMR3tOrMjMjC3Gt5mHe7EFw0Ry18VAa+1DIsziiDQHYZhHJLIUJpkCx5BsXKcoZGbaXc77p5sfVpg7wDdm+f7jZH8hYT3FY2wnU5Q0RJG+Ci1H4EiO2Du9BeXFI7gbLT8RiOoEQEEAh3AuGSgWHXrJfwyln0e83rNWKuXv3bip0v6Lz1ElhxqwpT/TIwIywHs2LyMZfmpHl3S8H1oBzcD8vB+6Qci9IJQmYZluaWQbakYkCtvHrdHxqBIssz+rmGdm8fa1ogSc0U8comiJUzRqTMAVxYeQB+4kZwFzHEGQFDeK2zRpbNVbwJoYnSm1YMt2wMu2U343zub357s/855utUo2ZrFe24a+jIUT6EKS6p+NYnE1NDczHjSiFmX3+GuQll4LxbjvnJ5eBKKQfP43IsSS+HdF5l/8b8Kpl3UoOFFqd1M/fbv03RsESimhnilA8hWv4gImQOInilKXzETeEmYgJnARPY85rAQcwKycaXMOhLEDxYichteeWW9avf3uhSqrVKUa/2jI4cZbTrrgQkr1Tj6zNp+MYrG1OC8zH9UjFmxJRhVlwl5iRU4PvECsxPogSkVEAqvapPIbd29TudhfPNXbTT9jm8SdawRoKaJa4rWyBK3gIXZcwRuNIMXhJmcBE1g4OAGY7zmcGKi8RviRt7QtF7npZM74JW+BUK/lvzxVisWYQmFaomJZpalIvpyJE/hEl2qZjonIFJHjmYHFCAqWElmH65HDOuVmLmdYIQXwnuxEqIp1T1rkurk3ov63CWmevuJ/pOb5J22iJezRpXlY8gUv4wLsgcht9KK7hLWOGMiBVOClrhKJ8lLLgtcWCeJYwWHEHE1hA0n0tvQ1Cx0D+7/p5iCGkUolWZFhYFCo4CVZIiQZC4WIUJx57iK8dMTHTLwyTfQkwOLsWU8ApMu1xFSagCZ1wVRO/W9MikPF/O9j5bhvl5jcf6Z/+SuMMecaq2iFayRbicDYJljsJH6ihcxY/CSeQo7AStcZjPGge5rWEwzxp6c49Ad/4xeKmEdF/Wjv1/b4c0aQ+ztWC4YwMZl6XKkcsZhbAp6zUmWz3CBNtUfOVAAFzy8bVnMSb5l2FySCW+DaNlMaoKS27WdkklNoizfYiWfsh7+8O9rq8TtjkgdpM9LivaIVTWDv7Sx+EhdRxnxY/jlMgx2AgcgwWfLYy5bbGP0xY6c22x5/vj+IHXAXuFzz3VE3Ux3/5T94/qBcOBKvnDr9aT4bXZo1rPgkB/S4ZU4Quzh5hgQwBOZmHiWQJwvgT/412OSQGVmBFaBf6Yms7l8XVLP+hp7JGpr3qyrvvrm1udEb3RAeEbTiF4/Un4rDkJ1xUn4CR2AnbC9jgicAKHeO1hyG0PvXn20JpjB43Zdtgx5wS2f+8A2TtdWENGV+WMajVpDQsC9YpZf8G3pg/wpRklwJoA2BMAJwLgUoKvPSow1b8SfOG17SIxz0X+lP8RSDkQsPmujuer61vOIVLpNELlneG/zgkeqx1xdrkjTok5wlbYAZYCDjDhPYV9XKegM+8Uds05ie0zT0Jt+kla27sgzhpp0nIyLTUGYg1JIqQaXxgljwFIw1d22Zh4qoBWgxJMJQA8wVVtS8Nqhf7U/xK5bxisclvbZyh6sxvCNpxDkOxZeK89A7dVZ+AseQb2y07DWug0zPhPw4jXGXu5nKHN6QTNOU7YNtMJEre7aNMCiJEkWCDI+ArSuqw3mHIgeQTAhJ8BHCcAJwsw5WwpeHyrW4SCqwXZPoaWZHRBKU4rYDBSxQMh8ufht84N7tKuOLvSBQ4SLji21AVWQi44yH8OBrznoMt1Fns4z0BjzhmIUwmI0KwvSlpGAMTHQCwLrcF4vUR8ceA+JeAxJhxJw8RjtAdwLMJCj/JmUf8qfraPqSXsC90QqxnIvKjkhYD1HvCS8YDrag84rXCHvdh5HBU9D/Ml52G82A37eNzw4wJXaHG6YFliNx1gAGESCwQrDVI5bzHNMAlf7L2LL8cAfHUkHVPsc8HrWtok5FvOx/Yxtut6EXKXdwQzAhV8qAy84bbGG2ekvHFK0gvHxLxwWMQThwQ9YLTIA/o87tBZ4I6l97ohQJueJQRAaAyCSFgtxmsn/B+ACQRgik0meM4WvRDxKOVh+5hbjE74urCtIQM+sn5wW+1LZeAHxxV+sJfwxdGlvrAQ9oGpgDcMF3lj70IviCb1YDFtdvgJgiBpWcEwphvcGwWgfw8TjB/gW6tU8Djm1Qt6FnOzfQotYneETPCW0H73tQGUAH84Lg/ACYkASkEAjoj6w2yJP4wF/GGwyBfCP/WArwhYRBBYIAQv12G8RhzG/3AbX+5LwmTaAyy0z6wTOle4gO1TaqG7o1b7qob1nZMOhAMBsJcIhK1YEKyXBsFSOAiHlgTiAH8ghJJ7wUMAWBAEiocxbT+NvuZNfKFzB5Mp/gtt02pFHfLmsX2KzW/7pZWeKmG9jquCYCceCJtlQZSAYFiKBMNMKASmgsFYcr8X3CUADx16+GIawL41FuN33cRk/btYeORxFb/dE062T7n5br+y3FXpUs8JqRACEIzDLADCIQTgAg4uuQDB+33gYgEgTTNKwvjt1/GNzm1wm92vFLJKmcv2OTTPbTESZxUju45JXqCVIIQmwhAcGgEQCn4CMJ/Mc8U1g2NzNL7Rugkuk5/KRK2ezmb7nJrH5phlTgqRndbioTAXvkBzwBiAB32Y9wyYYnof3+y8Bm7Du8/4LVNmsn2OzWVTrOhJucsdVmIXR+LPArCYAHDeacck9Rhw70soFjS9+R3b59xOb7wibC8b1WYpFkZlEAqBlD7Msn4MLt2bhQuN70xn+09oTqox/KcUrxYdk4nCyuuN4Psx7vEio+SpbP9ZDf/lqB4rtCmo/E89zv4vFFKPvbqC2oMAAAAASUVORK5CYII=
// @match        *://www.torrentbytes.net/browse*
// @match        *://www.torrentleech.org/torrents/*
// @match        *://beta.torrentleech.org/torrents/*
// @match        *://scenehd.org/browse*
// @match        *://www.alpharatio.cc/torrents*
// @match        *://alpharatio.cc/torrents*
// @match        *://superbits.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27797/Torrent%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/27797/Torrent%20Highlighter.meta.js
// ==/UserScript==

var arCatColor=new Array();
var arCatPic=new Array();

// SETTINGS START
// arCatColor[CATEGORY_ID]="#COLOR";

arCatColor[17]="turqois";     // Games PC
arCatColor[18]="turqois";     // Games XBOX
arCatColor[19]="turqois";     // Games XBOX360
arCatColor[20]="turqois";     // Games PS2
arCatColor[21]="turqois";     // Games PS3
arCatColor[22]="turqois";     // Games PSP
arCatColor[28]="turqois";     // Games Wii
arCatColor[30]="turqois";     // Games Nintendo DS

arCatColor[23]="red";        // Apps PC-ISO
arCatColor[24]="red";        // Apps Mac
arCatColor[25]="red";        // Apps PDA
arCatColor[33]="red";        // Apps PDA

//The baseurl where your icons are located.
var iconUrlBase = "https://dl.dropboxusercontent.com/u/11442202/TLIcons/";

// arCatPic[CATEGORY_ID]="ICON_URL";
// arCatPic[11]=iconUrlBase+"movies_.png";          // Movies DVDRip/DVDScr
// arCatPic[8]=iconUrlBase+"movies_cam.png";        // Movies CAM
// arCatPic[9]=iconUrlBase+"movies_tstc.png";       // Movies TS/TC
// arCatPic[10]=iconUrlBase+"movies_r5.png";        // Movies R5/Screeners
// arCatPic[11]=iconUrlBase+"movies_dvdrip.png";    // Movies DVDRip/DVDScr
// arCatPic[14]=iconUrlBase+"movies_bdrip.png";     // Movies BDRip
// arCatPic[12]=iconUrlBase+"movies_dvdr.png";      // Movies DVD-R
// arCatPic[13]=iconUrlBase+"movies_hd.png";        // Movies HD
// arCatPic[15]=iconUrlBase+"movies_boxset.png";    // Movies Boxsets
// arCatPic[29]=iconUrlBase+"movies_docu.png";      // Movies Documentaries

// arCatPic[17]=iconUrlBase+"games_pc.png";         // Games PC
// arCatPic[18]=iconUrlBase+"games_xbox.png";       // Games XBOX
// arCatPic[19]=iconUrlBase+"games_xbox360.png";    // Games XBOX360
// arCatPic[20]=iconUrlBase+"games_ps2.png";        // Games PS2
// arCatPic[21]=iconUrlBase+"games_ps3.png";        // Games PS3
// arCatPic[22]=iconUrlBase+"games_psp.png";        // Games PSP
// arCatPic[28]=iconUrlBase+"games_wii.png";        // Games Wii
// arCatPic[30]=iconUrlBase+"games_nds.png";        // Games Nintendo DS

// arCatPic[23]=iconUrlBase+"apps_pc.png";          // Apps PC-ISO
// arCatPic[24]=iconUrlBase+"apps_mac.png";         // Apps Mac
// arCatPic[25]=iconUrlBase+"apps_pda.png";         // Apps PDA

//Enable release specific colors/icons.
var EnableRegexReleases = true;

//Regex to prevent false matches.
var reReleasesFalse = "1080i|mpeg2|dd5.?1|subbed|dubbed|hebsub|(?:(?:[0-9]+x|s[0-9]+).*(?:bluray|french|spanish|italian|nordic))";

//Regex to hide entries.
var reReleasesHide = "(?:(?:[0-9]+x|s[0-9]+).*(?:french|spanish|italian|german))|(?:arabic|baltic|subfrench|truefrench|hebsub|hungarian|islandic|polish|turkish)[\ \-\.]|dvdr-|-x0r";

//Colors for dark themes.
var strColors = {
  purple: '#4b1450',
  blue:   '#0f3c6e',
  red:    '#640000',
  turqois:'#19726f',
  yellow: '#222900',
};

//Colors for light themes.
var strColorsLight = {
  purple: '#ffc8ff',
  blue:   '#d7f5ff',
  red:    '#ffd4d4',
  turqois:'#c8ffff',
  yellow: '#ffee99',
};

//Find torrent table rows. Selector to find all torrent rows.
var strTorrentTableTRs = '#torrenttable tr';
//First TR index. Ignore row index lower than this (table header etc.)
var strFirstTR = 1;

//Category TD index. Column containing category link/icon.
var strCatTD = 0;
//Match category ID. Regex to find category ID.
var strCatMatch = '(?:\\?|\\/)(?:cat=|categories\\/)([0-9]+)';
//Get category image element. Image element in strCatTD.
var strCatImgElement = 'img';

//Name TD index. Column containing torrent name.
var strNameTD = 1;
//Element in strNameTD containing name.
var strNameSelector1 = 'a';
//Property of strNameSelector1 containing name.
var strNameProperty1 = 'title';
//Fallback if first fails.
var strNameSelector2 = 'a';
var strNameProperty2 = 'innerHTML';
//Regex to clean name (case insensitive).
var strNameCleanRegex = "<[^>]*>";

//Mark most popular
var strMarkTop = true;
//Top count
var strMarkTopCnt = 10;
//Downloaded or Seeders TD index. Column containing download or seeders count. Negative number = start from end.
var strMarkTopTD = -2;
//Find number element. Regex to find number in strMarkTopTD.
var strMarkTopRegex = '\\d+';

// Site specific settings. You can add the above settings here.
var domain = window.location.host.match(/(?:www\.)?(.*)/i);
if (domain) {
  switch (domain[1]) {
    case 'torrentleech.org':
    case 'beta.torrentleech.org':
    case 'classic.torrentleech.org':
      strTorrentTableTRs = 'table.torrents tr';
      strCatMatch = 'data-cid="([0-9]+)"';
      strNameSelector1 = 'a';
      strNameProperty1 = 'childNodes';
      strMarkTopTD = -3;
      strMarkTopCnt = 20;
      iconUrlBase = iconUrlBase+"dark_";
      (new MutationObserver(torrentleech)).observe(document.querySelector("body"), { attributes: true });
      function torrentleech(changes) {
        if(document.querySelector("div.pace.pace-inactive")) {
          doMain();
        }
      }
      break;
    case 'superbits.org':
      strTorrentTableTRs = 'torrents-table table tbody tr';
      strCatMatch = 'category([0-9]+)';
      strColors = strColorsLight;
      iconUrlBase = iconUrlBase+"light_";
      strFirstTR = 0;
      (new MutationObserver(superbits)).observe(document.querySelector(".container"), { childList: true, subtree: true });
      function superbits(changes) {
        if (!document.querySelector(".categoryImage")) {
          window.requestAnimationFrame(superbits);
        } else {
          doMain();
        }
      }
      break;
    case 'alpharatio.cc':
      strTorrentTableTRs = '#torrent_table tr';
      strCatMatch = 'filter_cat\\[([0-9]+)\\]';
      strNameSelector1 = 'a[title="View Auto Torrent"]';
      strNameProperty1 = 'innerHTML';
      strMarkTopTD = -3;
      break;
    case 'torrentbytes.net':
      strTorrentTableTRs = '#content table:not([class]) tr';
      strCatMatch = 'browse\\.php\\?cat=([0-9]+)"';
      strNameSelector1 = 'a.index';
      strNameProperty1 = 'title';
      strNameSelector2 = 'a.index';
      strNameProperty2 = 'innerHTML';
      strColors = strColorsLight;
      iconUrlBase = iconUrlBase+"light_";
      break;
    case 'scenehd.org':
      strTorrentTableTRs = 'table.browse tr';
      strCatMatch = 'cat=([0-9]+)"';
      strNameTD = 2;
      strNameSelector1 = 'a[class*=torrent]';
      strNameProperty1 = 'title';
      strNameSelector2 = 'a strong';
      strNameProperty2 = 'innerHTML';
      strColors = strColorsLight;
      iconUrlBase = iconUrlBase+"light_";
      break;
    case 'torrentshack.me':
      strTorrentTableTRs = '#torrent_table tr';
      strCatMatch = '\\?filter_cat\\[([0-9]+)\\]';
      strCatImgElement = 'div';
      strNameSelector1 = 'a[title^=View]';
      strNameProperty1 = 'title';
      strNameSelector2 = 'span.torrent_name_link';
      strNameCleanRegex = "<[^>]*>|View Torrent |\\[REQ\\] ";
      iconUrlBase = iconUrlBase+"dark_";
      break;
    case 'sceneaccess.eu':
      strTorrentTableTRs = '#torrents-table tr';
      iconUrlBase = iconUrlBase+"dark_";
      break;
  }
}

//Regex to match torrent name and how to highlight.
var reReleases = new Array(
  //new Array("REGEX_STRING", "#COLOR (optional)", "ICON_URL (optional)", ENABLE_ROW_COLOR (true/false)),

  //New seasons
  // new Array("(?:[0-9]+x01|s[0-9]+e01)", "yellow", "", true),
  //New series
  new Array("(?:1x01|s01e01|part\.0?1)", "purple", "", true),

  //Series
  new Array("^(?:\
^8.out.of.10.cats.does.countdown|\
^the.100|\
^the.americans|\
^an.idiot.abroad|\
^archer.2009|\
^ash.vs.evil.dead|\
^the.bastard.executioner|\
^bates.motel|\
^better.call.saul|\
^billions|\
^black.sails|\
^bobs.burgers|\
^brain.dead|\
^colony|\
^curb.your.enthusiasm|\
^da.vincis.demons|\
^deep.web|\
^facejacker|\
^family.guy|\
^downton.abbey|\
^the.expanse|\
^fargo|\
^futurama|\
^game.of.thrones|\
^halt.and.catch.fire|\
^hell.on.wheels|\
^homeland|\
^house.of.lies|\
^its.always.sunny.in.philadelphia|\
^the.knick|\
^the.last.ship|\
^louie|\
^lucifer|\
^mr.robot|\
^mythbusters|\
^narcos|\
^the.office|\
^outlander|\
^peaky.blinders|\
^penny.dreadful|\
^person.of.interest|\
^planet.earth|\
^preacher|\
^qi.*uncut|\
^ray.donovan|\
^the.ricky.gervais.show|\
^shameless.us|\
^the.shannara.chronicles|\
^south.park|\
^sherlock|\
^spartacus|\
^the.strain|\
^supernatural|\
^top.gear|\
^true.detective|\
^tutankhamun|\
^the.ultimate.fighter|\
^vice.principals|\
^vikings|\
^the.walking.dead|\
^westworld|\
^the.x-?files|\
^zoo|\
).(?:[0-9]+x|s[0-9]+|part|pt|bdrip|dvdrip|web).*(?:x264|h264|xvid)", "blue", "https://www.dropbox.com/s/94z5os94t9rtpco/tv_my.png?dl=1", true),

  //Games
  new Array("^(?:\
^assassins.creed|\
^battlefield|\
^far.cry|\
^grand.theft.auto|\
^mass.effect|\
^call.of.duty)", "red", "", true),

  //Misc
  new Array("derren.brown", "turqois", "", true),

  //Custom icon
  // new Array("-vision$", "turqois", iconUrlBase+"vision.png", false),

  //Match certain release types
  //new Array("(r5|dvdscr|scr).line",                                               "",         iconUrlBase+"movies_r5_line.png",  false),
  //new Array("([0-9]{1,2}x|s[0-9]{2}).*(dvd|br)rip",                               "",         iconUrlBase+"tv_dvd.png",          false),
  //new Array("([0-9]{1,2}x|s[0-9]{2}|[0-9]{4}.[0-9]{2}.[0-9]{2}).*hdtv.*x264",     "",         iconUrlBase+"tv_720.png",          false),
  //new Array("([0-9]{1,2}x|s[0-9]{2}|[0-9]{4}.[0-9]{2}.[0-9]{2}).*hdtv.*xvid",     "",         iconUrlBase+"tv_hdtv.png",         false),

  new Array("-ZZZ-", "#FFFFFF",  "", false)
);

// SETTINGS END

if (reReleasesFalse.length > 0) {
  try { var reRelMatchFalse = new RegExp(reReleasesFalse, 'i'); }catch(error){console.log("TCI : " + i + ": " + error);}
}
if (reReleasesHide.length > 0) {
  try { var reRelMatchHide = new RegExp(reReleasesHide, 'i'); }catch(error){console.log("TCI : " + i + ": " + error);}
}
var aRank = [];

var reCatMatch = new RegExp(strCatMatch);
//console.log(reCatMatch);

function doMain() {

  aRank = [];

  var strTRs = document.querySelectorAll(strTorrentTableTRs);

  if(strTRs.length == 0) return;

  var foundTRs = false;
  for (i = strFirstTR; i < strTRs.length; i++) {
    try {
      var strTDs = strTRs[i].getElementsByTagName('td');
      if(strMarkTopTD < 0) {
        strMarkTopTD = strTDs.length + strMarkTopTD;
      }
      var strCat = reCatMatch.exec(strTDs[strCatTD].innerHTML);
      if (strCat) {
        //console.log(i);

        strTRs[i].title = '';
        strTRs[i].style.cssText = '';
        for (x = 0; x < strTDs.length; x++) {
          strTDs[x].style.cssText = '';
        }
        try {

          var children = strTDs[strMarkTopTD].childNodes;
          //console.log(children);
          [].forEach.call(children, function(child) {
            if(child.style) child.style.cssText = '';
          });
        }catch(error){}

        strCat = strCat[1];
        var catColor = '';
        var catPic = '';
        var catPicSrc = '';
        var catRow = false;
        catColor = arCatColor[strCat];
        catPic = arCatPic[strCat];
        try { catPicSrc = strTDs[strCatTD].getElementsByTagName(strCatImgElement)[0]; }catch(error){console.log("TCI : " + i + ": " + error);}
        if(strMarkTop) {
          try {
            var cnt = parseInt(strTDs[strMarkTopTD].innerText.match(new RegExp(strMarkTopRegex))[0]);
            if(cnt>=0) {
              aRank.push({id: i, cnt: cnt});
            }
          }catch(error){console.log("TCI : " + i + ": " + error);}
        }

        if(EnableRegexReleases) {
          var RelName = "";
          try {
            RelName = [].reduce.call(strTDs[strNameTD].querySelector(strNameSelector1)[strNameProperty1], function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
          }catch(error){console.log("TCI : " + i + ": " + error);}
          if(!RelName) {
            try { RelName = strTDs[strNameTD].querySelector(strNameSelector1)[strNameProperty1]; }catch(error){console.log("TCI 2: " + i + ": " + error);}
          }
          if(!RelName) {
            try { RelName = strTDs[strNameTD].querySelector(strNameSelector2)[strNameProperty2]; }catch(error){console.log("TCI 3: " + i + ": " + error);}
          }
          if(RelName) {
            if(reRelMatchHide.exec(RelName)) {
              strTRs[i].style.position = "absolute";
              strTRs[i].style.overflow = "hidden";
              strTRs[i].style.height = "3px";
              strTRs[i].style.width = "50px";
              strTRs[i].style.background = "red";
              strTRs[i].onmouseover=function(){this.style.position = "";};
              // console.log("TCI : " + i + ": " + RelName);
              aRank.pop();
              continue;
            }
            RelName = RelName.replace(new RegExp(strNameCleanRegex,'ig'), '');
            //console.log(RelName);
            for (x = 0; x < reReleases.length; x++) {
              var reRelMatch = new RegExp(reReleases[x][0], 'i');
              if (reRelMatch.exec(RelName)) {
                // console.log("R: " + RelName + " [" + reRelMatch.exec(RelName) + "] F " + reRelMatchFalse.exec(RelName));
                if(reRelMatchFalse.exec(RelName)) break;
                strTRs[i].title = "Title: " + RelName + "\nMatch: " + reRelMatch.toString().substring(0,50);
                if(reReleases[x][1]) catColor=reReleases[x][1];
                if(reReleases[x][2]) catPic=reReleases[x][2];
                if(reReleases[x][3] == 1) catRow = true;
              }
            }
          }
        }
        if(catPic && catPicSrc) {
          if(catPic.length > 1) {
            try {
              strTDs[strCatTD].style.textAlign = "center";
              if(catPicSrc.src) {
                catPicSrc.src = catPic;
              } else {
                catPicSrc.style.backgroundImage = 'url("'+catPic+'")';
              }
            }catch(error){console.log("TCI : " + i + ": " + error);}
          }
        }
        if(catColor) {
          if(catRow){
            strTRs[i].style.backgroundColor = strColors[catColor];
            for (var x = 0; x < strTDs.length; x++) {
              strTDs[x].style.backgroundColor = strColors[catColor];
            }
          } else {
            strTDs[strCatTD].style.backgroundColor = strColors[catColor];
          }
        }
      }
    }catch(error){console.log("TCI : " + i + ": " + error);}
  }

  if(strMarkTop && aRank.length > 0) {
    //sort array
    aRank.sort(function(a,b) {
      return parseInt(b.cnt,10) - parseInt(a.cnt,10);
    });
    for (var i = 0; i < strMarkTopCnt; i++) {
      try {
        var opacity = 1-(((1-0.25)/(strMarkTopCnt-1))*i);
        strTRs[aRank[i].id].getElementsByTagName('td')[strMarkTopTD].style.cssText = 'background-color: rgba(255, 215, 0, ' + opacity + ') !important; color: #000 !important';
        strTRs[aRank[i].id].title = 'Top ' + (i+1) + '\n' + strTRs[aRank[i].id].title;
        try {
          var children = strTRs[aRank[i].id].getElementsByTagName('td')[strMarkTopTD].childNodes;
          [].forEach.call(children, function(child) {
            child.style.cssText = 'background-color: transparent !important; color: #000 !important';
          });
        }catch(error){}
      }catch(error){console.log("TCI : " + i + ": " + error);}
    }
  }
}

function addCss(cssCode) {
  var styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssCode;
  } else {
    styleElement.appendChild(document.createTextNode(cssCode));
  }
  document.getElementsByTagName('head')[0].appendChild(styleElement);
}

doMain();