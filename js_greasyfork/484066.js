/* ==UserStyle==
@name           EngineListForSearchEngineJumpPlusInt
@description    SearchEngineJumpPlusInt Engine List
@version        1.2
@license        MIT
@author         KParthSingh
==/UserStyle== */

const searchEngineJumpPlusEngines = {
  web: [
    {
      name: "Google",
      url: "https://www.google.com/search?q=%s&ie=utf-8&oe=utf-8",
      favicon:
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 15.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='48px' height='48px' viewBox='0 0 48 48' enable-background='new 0 0 48 48' xml:space='preserve'%3E%3Cpath fill='%23FFC107' d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3Cpath fill='%23FF3D00' d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'/%3E%3Cpath fill='%234CAF50' d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'/%3E%3Cpath fill='%231976D2' d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3C/svg%3E%0A",
      gbk: false,
    },
    {
      name: "bing",
      url: "https://www.bing.com/search?q=%s",
      favicon:
        "data:image/png;base64,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",
    },
    {
      name: "yahoo",
      url: "https://search.yahoo.com/search;?p=%s",
      favicon:
        "data:image/svg+xml,%3Csvg t='1666872979419' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='13466' width='32' height='32'%3E%3Cpath d='M513.216 69.568C332.224 69.568 161.216 45.76 0 0v1024c161.408-45.824 332.416-69.632 513.216-69.632 178.816 0 349.376 23.232 510.784 69.632V0c-161.408 46.4-331.776 69.568-510.784 69.568z m283.584 87.424l-6.208 9.792c-5.824 9.216-11.008 17.024-18.176 28.032-9.6 14.4-27.584 43.008-49.216 79.808-6.016 10.176-13.376 22.4-20.992 35.584l-44.032 74.368-16.384 28.608-43.392 75.584c-14.592 25.792-28.992 51.2-43.392 76.416v25.408c0 35.2 0.768 73.6 1.984 107.776 0.576 15.616 1.216 43.392 1.984 72.768 0.768 35.008 1.6 71.232 2.624 89.6l0.192 5.632v0.576l-6.016-1.6-6.976-1.792a197.952 197.952 0 0 0-22.592-3.584 172.224 172.224 0 0 0-28.416 0 195.712 195.712 0 0 0-29.568 5.376l-6.016 1.6v-0.576l0.192-5.632c0.832-18.176 1.792-54.592 2.624-89.6 0.576-29.376 1.408-57.216 1.984-72.768a2721.92 2721.92 0 0 0 1.984-107.776v-25.408L425.6 488.768c-14.208-25.024-28.992-50.624-43.2-75.584-5.632-9.6-11.008-19.2-16.384-28.608-12.8-22.208-29.376-49.984-44.032-74.368a2038.784 2038.784 0 0 1-20.992-35.584 1986.112 1986.112 0 0 0-49.216-79.808c-7.168-11.008-12.416-18.816-18.176-28.032l-6.208-9.792 11.2 3.2c14.208 4.032 28.8 6.016 44.416 6.016s30.592-1.984 44.608-6.016l3.392-1.024 1.792 3.008c27.584 49.792 101.824 171.776 146.176 244.8 15.168 25.216 27.392 44.992 33.408 55.168v-0.192 0.192l33.408-55.168c44.416-72.832 118.592-194.816 146.176-244.8l1.792-3.008 3.392 1.024c14.016 4.032 28.992 6.016 44.608 6.016s30.208-1.984 44.416-6.016l10.624-3.2z' p-id='13467' fill='%234C07A2'%3E%3C/path%3E%3C/svg%3E",
    },
    {
      name: "Yandex",
      url: "https://yandex.com/search/?text=%s",
      favicon:
        "data:image/svg+xml,%3Csvg t='1666872628734' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='10516' width='200' height='200'%3E%3Cpath d='M451 1024V691.8L229 96h111.6l163.6 459.4L692.4 0h102.6L553.6 695.6V1024h-102.6z' p-id='10517' fill='%23FC401D'%3E%3C/path%3E%3C/svg%3E",
    },
    {
      name: "DDG",
      url: "https://duckduckgo.com/?q=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADiElEQVQ4jXWTfVDTBRjHn+uyi8KAbWz7/TbeNzeUeNkLCljGS3hrspDUsC7vqivz5cI/OtQ7vSxNrpvdkQx0k10M5FYgztECgfOoM7kurs6IFx1ja7xsgMiLAySDffvDtLrs8/fz+T7PH8+X6BFIQymxOGb1WyWy8COH13LL9svCSgtEoTt4RMyj5h/CIRKfSImsMKu4NrOKZ6vZwDafz2Tbajaw9ur1wibzemHj+7Lwo0S06j9yYtgqRX0m216lFDS0FCR3Obcl3/FvFmJCFwt/0Rr0aOPGrVlsuymduVShEljDiCL+3hxCUbWZTLtBwfuqXyeZCThqsTTUj0BrPUZ2psGTE4mxQilmt8twLT/WVaUSXvgsjW8hoseJiOhYUuTpSqWw8YYmPjC6JQ5TtXqsLAYAAMu3fLj9eSk8eQw8OimmXpGjMzfWaU5nv94RvfodkoQ+se6cmm2+tDGqe1Ijxm+HXsd4IIi5+WUAQBDA6MRdePdq4c4Xw12wBlNFifginW0tTxN8Sa9Gh+02qlh7v0ayOJTNh8d4Ev7AMq4P+BAM3g/4rm8KvdVn4H6exWCOHMMaOTqzY1wGJXORDkg5H1ermZYRnQyubCEG9R/Av7CCsnOd+P3eCgCg68YCbnZ0YGyXCLf0AowfjML1PMm8UcHaqVTOO1WjFnWMFMjgyhWjZ48OC3/cPx9YRnD6POArAoZSsfT9k7jTEIHR/THoyZXerVYzLfReQvjRs0qRw7NFBmd+HH4pTMXk6Mhf/jTg4WDGRBjex4f33Th43ojHoEaG7nzJXKWSsdHLwmd2VSmE9h9flMwNaqT4NSca3mudeMCs4xDGj4fgdiUfc1YOJssF8OpkcGTF9FUomIvEIRIb0li7RSX+dqxAjt6NAgxYDA8Dpq116E+JhHdzPJxaKfpyZBjWymFQsPZPkvgWIiLancA9Up7C2K5sivd6XxCh98MS+JYmMDzvxqJ7AN2FctSVKtC9dS18LyWiXh3dZVKK257jPaV98IxPn0oWNpYlCera1cxN/55itLpt2H45A3uvbMObjiy89pMWP7ydioZk0dXyFNZWIuGW/asLoUR8fZLQenod325MlzsuXLVMHnMeRIXrLC67G4OHP8roPZ4hajI9y7YdSOB9+n+FfKw4KmLfSUlEbdPOvJ9dJv3sUnMTZmqM9yypsd+ckHLNm7ghW/8p/Alp3+8i87OHIgAAAABJRU5ErkJggg==",
    },
    {
      name: "Startpage",
      url: "https://www.startpage.com/sp/search$post$query",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA9ElEQVR4nO2WTUoDQRBGX5txIMRs/EFBAm49iEfxBN5J8AAeZwwkgmTR6e6ZHsNMDO2iFkEyibqQcVG1+aq74KvXteky9w8p0WMc9dlcARRAARRAARTgXwBk+z5jYyA/3p7zvDv/Ltp2N2/XoilBNj4Rw6sLuDyXwuRa9OxUdDz6ajoc/hwAYLUSrertnV2KmpT6XUiyvzBtGplxjPLksooA+FAB4HzZDdA0a2Ksmb2+4XzJYmFxPlBM51jr8aHCLgPOBQDqd5ntx2ZzECgbDPbWzOPTcyqmM5wvKV7mOw26zA8Z/jbMze2dLqUKoAAKoAC9xic+GmK9S0OJvAAAAABJRU5ErkJggg==",
    },
  ],
  video: [
    {
      name: "YouTube",
      url: "https://www.youtube.com/results?search_query=%s",
      favicon:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='external-icon' viewBox='0 0 28.57 20' focusable='false' style='pointer-events: none; display: block; width: 100%25; height: 100%25;'%3E%3Csvg viewBox='0 0 28.57 20' preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath d='M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z' fill='%23FF0000'%3E%3C/path%3E%3Cpath d='M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z' fill='white'%3E%3C/path%3E%3C/g%3E%3C/svg%3E%3C/svg%3E",
    },
    {
      name: "bilibili",
      url: "https://search.bilibili.com/all?keyword=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAwElEQVQ4ja2Syw2DQAxEhwvdIHEklENFUIIN5EAftGAjigA6cA58krBZaZMwki+7nqfR7gC7zCLQUKDRBD41moCGAmaRe9mOKUgMrAsayVyzZGBdQGJox9QFmEVgbT9CXs2k9/cEncUgKcEyrQsBs+6W6CwGSMpgozslQDKDxFBr7n28s2rNN8CMg/atDt8ZwNqDtXcM53MvwJfIu3d5glBdCZi3ht2Czfs3skwAa/VzkVirZ5WPJEEzg7Vaq/ynHh0yOLrBLqn3AAAAAElFTkSuQmCC",
    },
  ],
  music: [
    {
      name: "Spotify",
      url: "https://open.spotify.com/search/%s",
      favicon:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496 512'%3E%3Cpath fill='%231ed760' d='M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8Z'/%3E%3Cpath d='M406.6 231.1c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3zm-31 76.2c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm-26.9 65.6c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z'/%3E%3C/svg%3E%0A",
    },
    {
      name: "YT Music",
      url: "https://music.youtube.com/search?q=%s",
      favicon:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 176 176'%3E%3Ccircle cx='88' cy='88' r='88' fill='red'/%3E%3Cpath fill='%23FFF' d='M88 46a42 42 0 1 1 .01 84.01A42 42 0 0 1 88 46m0-4a46 46 0 1 0 .01 92.01A46 46 0 0 0 88 42z'/%3E%3Cpath fill='%23FFF' d='m72 111 39-24-39-22z'/%3E%3C/svg%3E",
    },
    {
      name: "Soundcloud",
      url: "https://soundcloud.com/search?q=%s&ie=utf-8&oe=utf-8",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAaVBMVEX/////IwD/dwD/dgD/JQD/dAD/IgD/KQD/awD/cAD/LgD/LQD/cQD/bAD/ZAD/XAD/ZQD/UgD/RwD/PQD/NQD/mln/28X/8ej/uIv/lVr/s4n/jln/8+7/nXD/XhL/1cX/rpn/4dr/fl2k0PaOAAAAfUlEQVQYlV3Jiw7CIAwF0EtRHDBeG76nU///I22HiQnn3qQtgIg0aS410I08yIfGvgM7buxoG4RhE4bA5YmYc8zxGE/nS5YdiV0TEoCb7CjlXiABlsezFEwTWsTK1zyjRSx81fqqb4ncn1rhvHfecX8Thw52HagOzJ8ySpkvwZsI6KQdPnwAAAAASUVORK5CYII=",
    },
  ],
  image: [
    {
      name: "Pinterest",
      url: "https://www.pinterest.com/search/pins/?q=%s&rs=typed&term_meta",
      favicon:
        "data:image/png;base64,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",
      blank: true,
    },
    {
      name: "tumblr",
      url: "https://www.tumblr.com/search/%s",
      favicon:
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 14.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 43363) --%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Calque_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='256px' height='256px' viewBox='0 0 256 256' enable-background='new 0 0 256 256' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Crect x='0.24' y='0.167' fill='%23314358' width='255.52' height='256'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3Cpath fill='%23FFFFFF' d='M168.08,170.918c-2.969,1.416-8.647,2.648-12.881,2.754c-12.783,0.342-15.264-8.979-15.367-15.736v-49.705 h32.065V84.055h-31.954V43.382c0,0-23.008,0-23.383,0c-0.385,0-1.057,0.337-1.152,1.192c-1.368,12.448-7.192,34.296-31.416,43.032 v20.624h16.16v52.167c0,17.863,13.176,43.24,47.959,42.641c11.736-0.201,24.77-5.113,27.648-9.354L168.08,170.918'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A",
    },
    {
      name: "flickr",
      url: "https://www.flickr.com/search/?q=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA+klEQVQ4jWNgGAUIIKBqwKCfUMSgGZXJwCklhy6twSCoW8BpUZTFaZIjz8CviCprXtbFkHX3PxynXPrGoBIQC5Ou57Fv/C/Z+B+Gf4jV/szgMs6EyMq7BqJoRjaEQ1zRmUXRFVkzsiEaDIK6DAwuE1ZgNSDr7n8Gvbj8Wfy+c7AZ8F+y8X8tl30dA4PrlNU4DdBPKFrCH7QUlwGNPE4tDAzqoclYNaff+MMgoGoQwaYdhcsAGxY5G0g4eExZh2GAUVY1LBCX8wevQNfcyevShRoTim4hDHZNMxls6yczSJjao0ejP5ta4Axe35mT+DwnO7MoupKfXoYfAABPvsL2GuU3QwAAAABJRU5ErkJggg==",
      blank: true,
    },
    {
      name: "pixiv",
      url: "https://www.pixiv.net/search.php?word=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACaElEQVQ4jY2TS0iUYRSGjwupXYsIAqFdDl13tclNd6WgZVQULZrB6ddsbhA1FwkyNQOjCMz805nxMiM6ajq/OkjZxQElLS0sK6NQI7QkCCrTnhbfmBMatXj54PDxfO97zvlERERM245IlqbLXut/StNlj7VM0kzbRdZlHBVfJ+LtQDzGgtwGci6KuKN/1ueVH0Nc9bMi+3KD4u1AnGHEHkK0IHIyiNhDLD/TQIozrGpaEHGE1D1nGHGGEF8nIpnZt8QdRaxBUh0hDvl70HtHaR4ao/XZBLHn72kcHONwoAc5XYucqkFcCYjHQGSHRRdXC8eCcQbHp3kwOsnxQBxTQRurPBHSL7Ria3jE568zdL/6wGp3REHmASv3a3rkxRTfZ+cAWHsxipyoVK/Z69RpriK9oI0fcz/pH/vEMkdIxfUYSHlFhd40Mo29aQCATZc6kNyapKxhZdlchaPlMQCW+j7EGkg0s+SqnlZ8F0u4D4DNJUsAnGEkt4b1RQYAxvAEolWrCaVmaXqKsxlngv5XQF4taedvA9D39iOSV6sAssuiiy2C618ArZqtpTEA6p+8U2N1RxHZa9XF3vQbsKG4fTHAFkLMVfj73gCQVd6tIniMxYAtpTE1BWtAKduP5FTjbR8C4Nr9l0hOddIeJAD2ZjWFh6OTlPe8xmcMYWse4HLXMIPj00x9+YYt0q/c2euSAJnZlckOdl6/w4GybrztT7lyb4TCrmEO+uOsONuoHCWvswJoleJsxZFwYCoyEHPVQgRrQOW11S1ubH4MkTUbd4tWM1MYnwAg42Yv4mpZ+gcmyxdDrDcmfgF4QGAxnLBCrgAAAABJRU5ErkJggg==",
      blank: true,
    },
    {
      name: "Google",
      url: "https://www.google.com/search?q=%s&tbm=isch",
      favicon:
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 15.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='48px' height='48px' viewBox='0 0 48 48' enable-background='new 0 0 48 48' xml:space='preserve'%3E%3Cpath fill='%23FFC107' d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3Cpath fill='%23FF3D00' d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'/%3E%3Cpath fill='%234CAF50' d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'/%3E%3Cpath fill='%231976D2' d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3C/svg%3E%0A",
    },
    {
      name: "Bing",
      url: "https://www.bing.com/images/search?q=%s",
      favicon:
        "data:image/png;base64,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",
    },
    {
      name: "Yandex",
      url: "https://yandex.com/images/search?from=tabbar&text=%s",
      favicon:
        "data:image/svg+xml,%3Csvg t='1666872628734' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='10516' width='200' height='200'%3E%3Cpath d='M451 1024V691.8L229 96h111.6l163.6 459.4L692.4 0h102.6L553.6 695.6V1024h-102.6z' p-id='10517' fill='%23FC401D'%3E%3C/path%3E%3C/svg%3E",
      blank: true,
    },
  ],
  download: [
    {
      name: "You",
      url: "Hi!",
      favicon:
        "",
    },
    {
      name: "Can",
      blank: true,
      url: "Technoblade never dies",
      favicon:
        "",
    },
    {
      name: "Edit",
      url: "Are you having a good time?",
      favicon:
        "",
    },
    {
      name: "These",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      favicon:
        "",
    },
    {
      name: "Shhhh!",
      url: "PlD",
      favicon:
        "",
    },
  ],
  shopping: [
    {
      name: "Amazon",
      url: "https://www.amazon.com/s?k=%s",
      favicon:
        "data:image/png;base64,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",
    },
    {
      name: "Walmart",
      url: "https://www.walmart.com/search?q=%s",
      favicon:
        "data:image/svg+xml,%3Csvg width='47' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cg id='layer1'%3E%3Cpath d='m23.548721,17.863708c1.023743,0 1.866257,-0.532471 1.979996,-1.219971l1.011261,-11.430054c0,-1.130005 -1.32251,-2.057495 -2.987503,-2.057495c-1.662506,0 -2.983749,0.92749 -2.983749,2.057495l1.008743,11.430054c0.112503,0.6875 0.955002,1.219971 1.975006,1.219971l-0.003998,0' id='path2974' fill-rule='nonzero' fill='%23fdbb30'/%3E%3Cpath d='m17.371231,21.433716c0.513748,-0.88501 0.473755,-1.881226 -0.066193,-2.32251l-9.395004,-6.589966c-0.976303,-0.565002 -2.441299,0.116211 -3.272552,1.557495c-0.833755,1.438721 -0.686249,3.047485 0.288742,3.612488l10.40126,4.84375c0.651245,0.241272 1.537491,-0.222534 2.047501,-1.107483l-0.003998,0.005981' id='path2976' fill-rule='nonzero' fill='%23fdbb30'/%3E%3Cpath d='m29.731232,21.42749c0.512497,0.88501 1.395004,1.348755 2.046249,1.107483l10.402496,-4.84375c0.980011,-0.565002 1.12001,-2.173706 0.292511,-3.612488c-0.835007,-1.441223 -2.302505,-2.122499 -3.27626,-1.557495l-9.395004,6.590027c-0.537491,0.441223 -0.577499,1.4375 -0.066193,2.322449l-0.003998,-0.005981' id='path2978' fill-rule='nonzero' fill='%23fdbb30'/%3E%3Cpath d='m23.548721,32.140015c1.023743,0 1.866257,0.528748 1.979996,1.216248l1.011261,11.428772c0,1.132507 -1.32251,2.058716 -2.987503,2.058716c-1.662506,0 -2.983749,-0.926208 -2.983749,-2.058716l1.008743,-11.428772c0.112503,-0.6875 0.955002,-1.216248 1.975006,-1.216248l-0.003998,0' id='path2980' fill-rule='nonzero' fill='%23fdbb30'/%3E%3Cpath d='m29.731232,28.570007c0.512497,-0.88623 1.395004,-1.347473 2.046249,-1.102478l10.402496,4.838745c0.980011,0.566223 1.12001,2.176208 0.292511,3.617493c-0.835007,1.436218 -2.302505,2.118713 -3.27626,1.554993l-9.395004,-6.58374c-0.537491,-0.446289 -0.577499,-1.442505 -0.066193,-2.326233l-0.003998,0.000977' id='path2982' fill-rule='nonzero' fill='%23fdbb30'/%3E%3Cpath d='m17.371231,28.568726c0.513748,0.883728 0.473755,1.880005 -0.066193,2.326233l-9.395004,6.58374c-0.976257,0.563782 -2.441254,-0.118713 -3.272507,-1.554993c-0.833801,-1.441223 -0.686295,-3.051208 0.288696,-3.617493l10.40126,-4.838745c0.651245,-0.244995 1.53749,0.216248 2.047502,1.102478l-0.003998,-0.000977' id='path2984' fill-rule='nonzero' fill='%23fdbb30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
    },
    {
      name: "Wish",
      url: "https://www.wish.com/search/%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAMAAAAocOYLAAAAb1BMVEUy5HYy6Hgz6nkuwmYpmlMx23Irq1sw1G4z7HojWTUbAAAvyWkssF0vzWstvGMqolcpkk8bAAQx33QgNiUiUzIz73stvWMnhEkcAA0gOicldUE08n0fLSIpm1MoiksdBBYfJR8eDBchQCokZjssr13mbdV2AAAAtklEQVR4Ae1QA7IDQRDd7jF6bev+V/yIVUzKeYM2gy8+CMAz89rM+NEgpLrTw/8NQBsrABDAWa9vUkgC5wEJKYQgij26hEc8PZt1lhfSUpm4qi6aUFtOddtV/bkZHOogTOLI+nEqrPEKXOJ1ZM8JQFnv27n7i5kKudgppH97cilQrNvOrEOsJu0L1ufq3o7c8mKqEP/qJ6ozI9n9nP88L5YhgNtBcO71nwwkbzfwdy8PzvLb+OIX5vgJuHeCxZ4AAAAASUVORK5CYII=",
    },
    {
      name: "New Egg",
      url: "https://www.newegg.com/p/pl?d=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFbElEQVRYhdXXX4icVxnH8c+ZPzu73W2iG7SJaYwxIYnR2NLgjQi5shQERW0vVIpKtSLqTbywN3rRikULQfFPqFaKIGgRKQqi6I2CNwoBQRAWtIWAJrRJ9s/8eWfmnfc9XpwzmZ3NpkYtiC887Lwz857f9zy/5zzPDv/jK7wai8TvWcEJ3ItVHMsfXcEf8fvwSZuvKkB82hIewMN4wJ6VJXuWaTdYalGXDAs2C9bHPVzA4+FTev8VQLxgL76ERx04sOKNb2L/G2gGVMQx9ZC6oOpT9ulu8bcNXh6v4f7waZf+bYD4bU08ii87cXLVW8/QXqbRystE4iQDFNR9qh7VFsUW3U1e2ODl8iLeGT5jDK3bEv+m02o/9uYjpxx/G6uHaC7R6KBNCMSIknqUATqENhq0IwsVd1V0N84Y1B/Dd28LIH7Dg2rPuu/tK07eR3MvrTtp3PEKAAOqNpppkcmE5pjWkD0desVnbwsgnveY/atPOn6cu4/T2kvzNTSnAIuEVtqlOlkQhoSFmbiK5ojGgNCh06Eeno7n48Fwzt9vCRCf8ozD+x5x+gR7D9FcScLTaCynDIS2WQ2USTxsE48lYUBYzGC5Zqp4ilsAxK96zOE9j3jHUdqvzX4v5V3fkcWnFmyr47At7TGfiFDkTGXx2CQGaqu7WhC/4kF3dZ70ltfRXKCxkB5udHIszl7fdIhCfr8iLhI76fnYJraoGkwCNSorsnkz8SccVHnW0WXuXEy7Cc3scztFaG1L+25XSJ9Pn4ktYoMKE5SRElXqjHMAKl9zsr1i/2KqbCF/JaT7sO1+7ipvhpguHSOTOgmP6xRlpPLinAXxi95lrw871SZETKNOf2OO6f3c1d5xn79X10yqdAzHJaMJo4qyrrA2n4HKOUfQiISamIxKxTTJuyxztyt3gdgmHss0C+oRk4JRQTGiGNMdU/lLeCLNhAbEL1hVea9DknDMhsUyVXIc5wYzyn0+v74JIqb3qyFVQVkw6jMcUAwYjKYAv5g+kSyYOOuAZrI277ge58iDpS5Sh9t5znf2gXqU5sCkx2iLokuvS7dPf0S/pPLcPEDllOWp7dVs5zfE+6m3VzvP+S6dsCqS+HCdwXV66/Q26Q1YLxjHi+Hr/rQT4KAFub5i8q8xIuahUi3MN5np2I07ZkEcJ8/HXQZX6V1ja53NLt2CjRGV89tNmwIs5OaQolGm3Yd2jmZqIjfESxrF/DCq62RZOUjjt3eNzatsrLPZ4+qAQb3GLP3bAa7rY5zW04xpsVCYO/exzuKj1JrDQrIgykdulAqut5mE16+zsUl3wPqYyufD06rdANasYzgFQJigmImLs/7eyP3dQgKsA1XJcMSgn1K+nmNzwD8Kivjz8Mys+ncC/MYllXs0p8MqaZbEQcqIelbljSJZE9tJfBJTkylG2etBjiGXh2zUV/CJneK2SYkf9Vv3OOsoVrCUN9hCq5WGSqOTZrqFlKq6mfr7ODKc0CvpjlKxbY15qeRyNcb94Qd+txvAbBpWnvKCs/aZDY7FbElrQqhScYZReqzOhTkODCODit6E7oRuxfWKazWVj4cf7i4+lwGIH/Jrd3u3k1jeloUbdSHN8tiYjdaRVCqDSL+mF7kauRwrfC78yIVbic9nAGofcckfREccyQCdHQAidZWGzFgCGGaIAi/hqh4eCs/51SuJ35QBiA85hl96vWMO75KBBJpnuwQxRg/XsOWv+ED4iT//K/FdASB+0Aq+Y9HDVrEvQ+SWL5rVSQ9b2LCJx/Gt8NP0P/9/DHAD5P3uxTm8R8fq9Ngj7brExEU8j++H5125XeHbApiDeZ8z0g/QlfzWGl4MP5v9zPq/vP4JBfOtkOL0ECoAAAAASUVORK5CYII=",
    },
  ],
  translate: [
    {
      name: "Google Tranlator",
      url: "https://translate.google.com/?sl=auto&tl=en&q=%s",
      favicon:
        "data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0' y='0' viewBox='0 0 998.1 998.3' xml:space='preserve'%3E%3Cpath fill='%23DBDBDB' d='M931.7 998.3c36.5 0 66.4-29.4 66.4-65.4V265.8c0-36-29.9-65.4-66.4-65.4H283.6l260.1 797.9h388z'/%3E%3Cpath fill='%23DCDCDC' d='M931.7 230.4c9.7 0 18.9 3.8 25.8 10.6 6.8 6.7 10.6 15.5 10.6 24.8v667.1c0 9.3-3.7 18.1-10.6 24.8-6.9 6.8-16.1 10.6-25.8 10.6H565.5L324.9 230.4h606.8m0-30H283.6l260.1 797.9h388c36.5 0 66.4-29.4 66.4-65.4V265.8c0-36-29.9-65.4-66.4-65.4z'/%3E%3Cpolygon fill='%234352B8' points='482.3,809.8 543.7,998.3 714.4,809.8'/%3E%3Cpath fill='%23607988' d='M936.1 476.1V437H747.6v-63.2h-61.2V437H566.1v39.1h239.4c-12.8 45.1-41.1 87.7-68.7 120.8-48.9-57.9-49.1-76.7-49.1-76.7h-50.8s2.1 28.2 70.7 108.6c-22.3 22.8-39.2 36.3-39.2 36.3l15.6 48.8s23.6-20.3 53.1-51.6c29.6 32.1 67.8 70.7 117.2 116.7l32.1-32.1c-52.9-48-91.7-86.1-120.2-116.7 38.2-45.2 77-102.1 85.2-154.2H936v.1z'/%3E%3Cpath fill='%234285F4' d='M66.4 0C29.9 0 0 29.9 0 66.5v677c0 36.5 29.9 66.4 66.4 66.4h648.1L454.4 0h-388z'/%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='534.3' y1='433.2' x2='998.1' y2='433.2'%3E%3Cstop offset='0' stop-color='%23fff' stop-opacity='.2'/%3E%3Cstop offset='1' stop-color='%23fff' stop-opacity='.02'/%3E%3C/linearGradient%3E%3Cpath fill='url(%23a)' d='M534.3 200.4h397.4c36.5 0 66.4 29.4 66.4 65.4V666L534.3 200.4z'/%3E%3Cpath fill='%23EEEEEE' d='M371.4 430.6c-2.5 30.3-28.4 75.2-91.1 75.2-54.3 0-98.3-44.9-98.3-100.2s44-100.2 98.3-100.2c30.9 0 51.5 13.4 63.3 24.3l41.2-39.6c-27.1-25-62.4-40.6-104.5-40.6-86.1 0-156 69.9-156 156s69.9 156 156 156c90.2 0 149.8-63.3 149.8-152.6 0-12.8-1.6-22.2-3.7-31.8h-146v53.4l91 .1z'/%3E%3CradialGradient id='b' cx='65.208' cy='19.366' r='1398.271' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23fff' stop-opacity='.1'/%3E%3Cstop offset='1' stop-color='%23fff' stop-opacity='0'/%3E%3C/radialGradient%3E%3Cpath fill='url(%23b)' d='M931.7 200.4H518.8L454.4 0h-388C29.9 0 0 29.9 0 66.5v677c0 36.5 29.9 66.4 66.4 66.4h415.9l61.4 188.4h388c36.5 0 66.4-29.4 66.4-65.4V265.8c0-36-29.9-65.4-66.4-65.4z'/%3E%3C/svg%3E%0A",
    },
    {
      name: "DeepL",
      url: "https://www.deepl.com/translator#zh/en/%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACNwAAAjcB9wZEwgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGZSURBVDiNjZKxaxRBFMZ/b2ZHbWITUxkRC4PnBUW0k1gkoFlMYmIR8R+w0UZBFAvtLAMS0ipC0guCd0GOa23EJGTPkBRCSCNHKiEgMzvPwmjCuiv3lft97zff7BuhQraWTouJLwE0mmf518a7spwUPxwZvlmLms8B4wWrLZhHPvuwUg44N9afGPcc4T5gK4pFgSUv/jHrre8HgKHJE4nzHWBgn/sZdBuYqQB1Q+5rbLR2DUBy1J89GIbEmNmQNW8DqxWAgcS5IQBT5vqYP3H1Gw9AHyosAKECVA4QuKfIPMhHVKygV4OVU8ByT4BDsiI6rWpusdbYUdgpBpLSMeGTRLYx2o5q9kT0ja2P3xU401ODQJz1neYdVRkT9C1gyob/Ngg/3VbifJf9TVg1L2Q43UC1eo3eb8KfB7O7uRf7T782Yo8hXBG4DFwvaRgFFoP4GTqt7u/bFuTOp5dU9BUw8u/BOhqy5fZ//4HvNL6ErHlNkSmFb4e9YM1WMV+5xjxrvM+P99VBngI/qnK96UI66OrpEhcnThatXx/tiqJJdDA6AAAAAElFTkSuQmCC",
    },
    {
      name: "Bing Translator",
      url: "https://www.bing.com/translator/?text=%s",
      favicon:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cg filter='url(%23a)'%3E%3Cpath fill='url(%23b)' fill-rule='evenodd' d='M18.85 10.08c.08-.96-.1-2.52-1.37-2.85-.5-.13-.3-.74.34-.6 1.02.22 3.32.8 3.63 3.45A2.73 2.73 0 0 1 24 12.81v7.75a2.73 2.73 0 0 1-2.73 2.73h-8.91a2.73 2.73 0 0 1-2.73-2.73v-7.75a2.73 2.73 0 0 1 2.73-2.73h6.49Z' clip-rule='evenodd'/%3E%3C/g%3E%3Cpath fill='%23fff' d='m16.97 13.11-1.13-.02-.02.52-.05.47h-.35c-.53 0-1.3-.07-1.6-.12l.02 1.01c.41.02 1.1.05 1.54.05h.28a21.75 21.75 0 0 0-.08 1.1c-1.22.58-2.14 1.75-2.14 2.87 0 .88.54 1.27 1.18 1.27.46 0 .92-.14 1.35-.35l.11.35 1-.3-.2-.65a6.7 6.7 0 0 0 1.84-2.65c.6.24.9.7.9 1.22 0 .86-.68 1.71-2.36 1.9l.57.91c2.15-.32 2.87-1.52 2.87-2.75 0-1.02-.67-1.8-1.68-2.14l.16-.45-1.07-.25a4.83 4.83 0 0 1-.07.52h-.16c-.43 0-.88.06-1.3.16 0-.26.03-.53.06-.8 1.07-.04 2.24-.14 3.1-.3l-.01-1c-.96.22-1.9.33-2.97.37l.09-.48.12-.46Zm-2.5 5.65c0-.5.44-1.16 1.09-1.6.02.6.09 1.2.18 1.74-.31.19-.63.3-.87.3-.28 0-.4-.16-.4-.44Zm2.08-2.03v-.02a4.38 4.38 0 0 1 1.2-.2 5.37 5.37 0 0 1-1.1 1.67 9.2 9.2 0 0 1-.1-1.45Z'/%3E%3Cg filter='url(%23c)'%3E%3Cpath fill='%23fff' fill-opacity='.55' fill-rule='evenodd' d='M2.73 0A2.73 2.73 0 0 0 0 2.73v8.4a2.73 2.73 0 0 0 2.54 2.73c.54 2.35 2.72 2.88 3.72 3.1.67.14.87-.5.35-.63-1.11-.3-1.42-1.5-1.45-2.47h7.18a2.73 2.73 0 0 0 2.73-2.73v-8.4A2.73 2.73 0 0 0 12.35 0H2.73Z' clip-rule='evenodd'/%3E%3C/g%3E%3Cpath fill='url(%23d)' d='M11.15 11.22h-1.4l-.7-1.96H6.04l-.67 1.96H3.98l2.88-7.69H8.3l2.86 7.7Zm-2.43-3L7.65 5.16c-.03-.1-.07-.26-.1-.49h-.02a3.14 3.14 0 0 1-.11.49L6.36 8.22h2.36Z'/%3E%3Cdefs%3E%3ClinearGradient id='b' x1='15.02' x2='24.6' y1='8.79' y2='23.5' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2381D1FF'/%3E%3Cstop offset='1' stop-color='%234667DD'/%3E%3C/linearGradient%3E%3ClinearGradient id='d' x1='9.75' x2='3.1' y1='12.21' y2='.25' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2366BAF7'/%3E%3Cstop offset='1' stop-color='%232B39BB'/%3E%3C/linearGradient%3E%3Cfilter id='a' width='14.37' height='20.12' x='9.63' y='6.61' color-interpolation-filters='sRGB' filterUnits='userSpaceOnUse'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeColorMatrix in='SourceAlpha' result='hardAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset dy='3.44'/%3E%3CfeGaussianBlur stdDeviation='3.44'/%3E%3CfeComposite in2='hardAlpha' k2='-1' k3='1' operator='arithmetic'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3CfeBlend in2='shape' result='effect1_innerShadow_303_1254'/%3E%3CfeColorMatrix in='SourceAlpha' result='hardAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='3.43'/%3E%3CfeComposite in2='hardAlpha' k2='-1' k3='1' operator='arithmetic'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0'/%3E%3CfeBlend in2='effect1_innerShadow_303_1254' result='effect2_innerShadow_303_1254'/%3E%3C/filter%3E%3Cfilter id='c' width='15.94' height='19.56' x='-.86' y='0' color-interpolation-filters='sRGB' filterUnits='userSpaceOnUse'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeColorMatrix in='SourceAlpha' result='hardAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset dx='-.86' dy='2.58'/%3E%3CfeGaussianBlur stdDeviation='2.58'/%3E%3CfeComposite in2='hardAlpha' k2='-1' k3='1' operator='arithmetic'/%3E%3CfeColorMatrix values='0 0 0 0 0.0447222 0 0 0 0 0.2576 0 0 0 0 0.670833 0 0 0 0.23 0'/%3E%3CfeBlend in2='shape' result='effect1_innerShadow_303_1254'/%3E%3CfeColorMatrix in='SourceAlpha' result='hardAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='6.45'/%3E%3CfeComposite in2='hardAlpha' k2='-1' k3='1' operator='arithmetic'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3CfeBlend in2='effect1_innerShadow_303_1254' result='effect2_innerShadow_303_1254'/%3E%3CfeColorMatrix in='SourceAlpha' result='hardAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='3.01'/%3E%3CfeComposite in2='hardAlpha' k2='-1' k3='1' operator='arithmetic'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.75 0'/%3E%3CfeBlend in2='effect2_innerShadow_303_1254' result='effect3_innerShadow_303_1254'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E",
    },
  ],
  knowledge: [
    {
      name: "Wiki",
      url: "https://wikipedia.org/wiki/%s",
      favicon:
        "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACKklEQVR4nM2Xva3yMBSG3xPdBai8Ah0WS1iUiCYbeINITBAWyApImSAjuKOgSUYwFRv43ILryCR2IN8VN58lGr/E5zm/TgiR5Zzj2P5vV5ZlNNzrNz5l9BVMtoTx0Gb214aHa3EAWiL84Vo8AosDfAHAbrfD7XaDEAKr1aoXu64DAFwuF2y326R+PB5RluWTfr/fsdlscDqdRs92XYf1eo3z+fxoB/8rioIBMBExEbG1lkO9rmsWQvR6qDnnWErJRMRVVY20siyZiFgp9bT/BGCt5TzPkwZCSAAjzT87BA/h27ZNA3gIb6BpmiiEBxx6CoDruh7931rLSik2xoy0EYBzjoUQDICllFEAKSUDYCFE760xhpVSUe+bpolGLAlQVVXv5TBnzjlu27aHFEKwMSaZMh+xPM/fB7DW9l6myLXWPWSe5yyEmASIpSYJ4L1MdUOYcyKKFlcYzVhXvAQIi01rPamHtRCrp5T2EsD3NRFxWZaTaYgVrFJqMjUvAZqmYSJKdoQ3npobAJLRewvA5zBWjMaY/nCvh1Fq2zZZ+bMAvKfDIRP2fJgGX4xa62RhzgYY9rxS6iklfg54CD/33zn7LYBw/vvDw2hYa0cFmZqi/wQwvKRid0R4h0gpJ1tvNsAwzFO1krqOfw3g3KPai6JI6v4OmXPm15zXp6IosN/vk/rhcMD1ep1z5OPL6Me7P19ZltHiL6X/B0Dsq/Xjhn9sRg1/qiZijn4DhUA2yPD/DEEAAAAASUVORK5CYII=",
    },
    {
      name: "Quora",
      url: "https://www.quora.com/search?q=%s",
      favicon:
        "data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M200 100C200 123.985 191.556 145.998 177.478 163.228L197 182.75C197 182.75 200 185.5 200 190C200 194.5 196 200 190 200H100C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0C155.228 0 200 44.7715 200 100ZM100 160C133.137 160 160 133.137 160 100C160 66.8629 133.137 40 100 40C66.8629 40 40 66.8629 40 100C40 133.137 66.8629 160 100 160Z' fill='%23B92B27'/%3E%3C/svg%3E%0A",
    },
    {
      name: "S.O.",
      url: "https://stackoverflow.com/search?q=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACRklEQVR4nM3XXWjPURzH8dcfUVsekjuhZVa0mI3kIeUhzcMFkvJ0sSgXLpCSkljZhRQXKLlAUliJkodSyhXSPJQ8jF14KuXG04rR/i7Omf2a/2y/bf/9fet0zu90Ht7nez7fc84vk81mFdIGFHR2DOqqQXPthLxMXLz3Jf4DD/Q1wDTcRXkhAIbjJmbgEkb0N8BnbEIWpTiHgfkGGIhJie+L2B/L1ajLN8ARPMDmRN0+XI3lnVidL4BxWIEhOI4zKEIr1uEFMjiFyfkAeI2puB2/N+AeygQ9LI95ES5jVF8DwAcsxAFBfOW4j1V4HqGyKNGJKHsCsBbLEn1/YRdW4hOGoR6HcEPQhAh6sLcAw3EUV9CIbbGO4ObpeCTs/XbcwknhXPgmeKVXAKPxJJbH4zDeRqgyvMJMnI5t5qBBEGkFTvQW4CnmoipO8gNDsUVY3XXMw8aYvqMl9mvKNWBPRfgANRiDPXgvuL0a1/BMUP8iLMa7zgZKA7BEiO+J2tX8UTj5SrBGuIgI23EEs7VvWU7r8j2QsB2YH8vNeIyHgjceCsfweeFG3IoFONbVoGkAfuKLEGbFmBVTm7UIq23AHdTia48ATp2t/1NOHOTVwpaVCidgZcyrMBKDY11lbL9UiIr0ANHaXquZRF2rEP+NuJCoHxtBKmI+RdRD/fi6LKxu2p0cp1sAaexNTJfSdkwDkPb9nnPFHa3gj9I0HujWitJawT2QyfVrFsOwr//ZMjXr/36dFdwD/9JAXva8oxXcAzk10J/2Gw08e05AgXJ5AAAAAElFTkSuQmCC",
    },
  ],
  sociality: [
    {
      name: "Twitter",
      url: "https://twitter.com/search/%s",
      favicon:
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 248 204'%3E%3Cpath fill='%231d9bf0' d='M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z'/%3E%3C/svg%3E",
    },
    {
      name: "Reddit",
      url: "https://www.reddit.com/search/?q=%s",
      favicon:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd' image-rendering='optimizeQuality' shape-rendering='geometricPrecision' text-rendering='geometricPrecision' viewBox='0 0 1000 1000'%3E%3Cg fill-rule='nonzero'%3E%3Cpath fill='%23ff4500' d='M1000 500c0 276.15-223.85 500-500 500S0 776.15 0 500 223.85 0 500 0s500 223.85 500 500z'/%3E%3Cpath fill='%23fff' d='M614.58 604.18c-28.71 0-52.08-23.36-52.08-52.09 0-28.73 23.37-52.08 52.08-52.08 28.71 0 52.09 23.35 52.09 52.08 0 28.73-23.38 52.09-52.09 52.09zm9.17 85.54c-35.54 35.5-103.67 38.25-123.69 38.25-20.04 0-88.16-2.75-123.66-38.27-5.27-5.27-5.27-13.82 0-19.09s13.83-5.27 19.1 0c22.4 22.42 70.33 30.36 104.56 30.36 34.23 0 82.17-7.94 104.63-30.36 5.27-5.27 13.81-5.25 19.08.02 5.27 5.28 5.25 13.82-.02 19.09zM333.33 552.09c0-28.73 23.38-52.08 52.11-52.08 28.71 0 52.06 23.35 52.06 52.08 0 28.71-23.35 52.06-52.06 52.06-28.73 0-52.11-23.35-52.11-52.06zm499.92-52.08c0-40.27-32.65-72.92-72.92-72.92-19.64 0-37.45 7.81-50.56 20.46-49.85-35.98-118.52-59.21-195-61.87l33.21-156.28 108.52 23.07c1.31 27.6 23.92 49.62 51.83 49.62 28.77 0 52.09-23.33 52.09-52.08 0-28.77-23.32-52.08-52.09-52.08-20.46 0-37.98 11.89-46.5 29.06l-121.18-25.75c-3.36-.75-6.9-.09-9.8 1.81-2.89 1.87-4.91 4.83-5.64 8.21l-37.08 174.37c-77.63 2.15-147.4 25.42-197.88 61.77-13.1-12.56-30.83-20.31-50.42-20.31-40.27 0-72.91 32.65-72.91 72.92 0 29.62 17.68 55.06 43.08 66.48-1.13 7.25-1.75 14.6-1.75 22.06 0 112.17 130.58 203.13 291.67 203.13 161.08 0 291.66-90.96 291.66-203.13 0-7.42-.6-14.73-1.71-21.92 25.55-11.35 43.38-36.89 43.38-66.62z'/%3E%3C/g%3E%3C/svg%3E",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/search/results.php?q=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAl0lEQVQ4jWNgoAbQtE48bOXX9J8UrGmdeBhugEvs7P8eSYtJwi6xs//DDcCnMCx31f9j5x79//X7z//3H7//v3H3NVyOKAP2n7j3Hx2QZMDXbz///////39+3RK4/0kyAAZcYmdhyOE1ABd4/PwjZQYsWXecOANg/oUBGN8hYhJ5YYBNbjgZYOJRdZhUA8w9a48QmVfxAwATIfnUl6gLIAAAAABJRU5ErkJggg==",
    },
  ],
  news: [
    {
      name: "Google news",
      url: "https://news.google.com/search?q=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAERElEQVR4nO2WTWhcVRTHf/e++crko/kyX201jQitIOnGhcWqUBWLSGgRVNCVFqouXFQFa0XQXRRcWBpBURRBo9JWcZGWghhqbVOK1I8uLEksmKS2yTRt5iszc+9x8Wbmzbx5mca1OfB4vHvOPf//+bjnPliT/7uoesq7v9k3o6JOn1gBBAFE3HfpG+C6FZqR8krJRhSQK8z+8eSh9SthhOoRWLTZPklaRDxIEWFagIxlZF2KRzov09/4A/suPc3ocqSCZJGOVn31MOoS8Ms8ihsGDug0j982z2DLONgomFaeWfc3o1cG/ou7mxMoiDBt4VYD77Utsrt7HEwWpAEQsC24YQpbW39h7KtOpjbGGFrvgAY0dOu6Va5PYNpqRlqW2Nt7EgoLUGgE4lCufkkEbIT471e5f0a41tzCdE+M4YE4X0bzdQnU0JOLjw2xcG6U8GyUXN29NTwWTvejvu+CmHF1YsFaQloRijeTibf/5LS2j7cd/GR/IAGZGJwnfK3j6o3nQMxN0GsJ5JcUS0ciqGil3jWyOPRcOoLWYfJNzbO6oWGs/dPDzyoAObNRMDlAg55j18+p4PMpHqb4vyVoTco6C4weayIf2YYCxJortxw/060BMOnzKO2F5C/xKsBXmSRA0IBY+ytuyKC2LWzF2LwXRjGiygfvqQSvQvBFX0m4nFFRCNB14uxDZQKu5E+txFoAI7BcAGurwQVIG0gZ9502kCoIaQNWqEmqIFhjpkouysdQ3Zt4QE51SSn6kiwsw+ieGH2dHtc9IxlmkkJIw+UsTLweJ0iOTeR443iejoiXSRB0InGgZKOrdjgeWwESOXjqLqcKHODN3Q5zy6XuriMV5VRAQUCh6Dh38YuaDABQyP9FiP5SBj54IsKdm0K8+tF1TvwTptGBRB56ItARUYhAbxQ2v5UGwIigcMuFQJMDMe1xSRpoU9Xnq5qAXR5Ds7dksqXfVR+dDbO5EXYMaArWS93YpCVn4cOhMMbW9rtSiqWMcHDcnYY5Acd3vqsIqO3p5+VH7rHCoOvAXe9wwFh4aVesavPHb6cIA9sHwzXgJRER3h/Pg0DaQiHvNXttBgDyfA0ugflFQ2erw+m0sDOiUK8kQMAMt6G1IqagKwrq5UQRzY8OhBQPt0fKRzGZyZysCjqI9aPvpATg+HXL1IthNvREsRYmZwy3b3DQCs7/meW1bw2JHHz3QgMmYHIfPZXj898MjcXmfvdw09zgWar+D3TttuIQEeHBFsV9h5ZdQw13bHTBL0xm2PGZe1NlDXS1aXo7a5+BHk2m4PkNpznvxwrMwM7hZFUys8bt/qRxO7uveNmUjC6kBFsxBU1RuSmqaAp50/PE/qYavOD/AV8tY7oa1F/qLXHPb8UFGDyuV0Ogjr2r9xn4gfyXVD1/qyewghf/vbCi+Qr7AwkowogED1kJ+JCKhaASiIBSgf2+JmvCvyV4A+6kXQlFAAAAAElFTkSuQmCC",
      blank: true,
    },
    {
      name: "Bing news",
      url: "https://www.bing.com/news/search?q=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB5ElEQVQ4jZ2Tv0sbYRyHX5Uzl8bLVNrSToUOHbr0T2gHqf1Baf8AvcUruNcpd5e75BK9H0Q9gptCogZKh6J2kWtDhkpxkmCwOIidijpYECoI5unQNo0QauwHnuUD78PL9/2+on9w0ItrWiSraiSNjER9w8NRTFUjuQvimhaJuKZ9ThaLJHyfGzMz3AxDRC6H7LooQYDi+50JApJhiJBVNVJ8nx7TZKhU4svhIYX1dW4XCsRsm4FstjOOg+K6fwXCMHiysMCfvKhUELp+OcHjcrkleL60hEil/l/wslKhxzAQuk6vaRLPZC5/g9dra5jVKvdnZ5FtG5FKIVkWSjeCB3NzvFpeBuD7yQnvd3YYW13lztQUsm1fLHhUKnE1n6e+v0973mxtIaXTJDKZLoY4Ps71yUneNhqt/uPuLrJlceUiwcP5ea5NTJCt1fh2fNzq321vI6XT/xacNZuUNzdpHBy0Dp41m1Tqde4Vi/RbVucZPG1bpPbU9vZ4triIlE7TZ5qdXyFmWdzyfYobG/w4PQXg69ERYysrKI6D0PXzu9Am+KAEAYrjELNthGEwVC5jVqvcDUOErv/6E45znlwOxfMQ8ujop2QYorguiueRcF16HQeRzSLl8wz87hXXPY/nkZye5icfi28JEi0cegAAAABJRU5ErkJggg==",
      blank: true,
    },
    {
      name: "CNN",
      url: "https://edition.cnn.com/search/?q=%s",
      favicon:
        "data:image/png;base64,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",
      blank: true,
    },
    {
      name: "BBC",
      url: "https://www.bbc.co.uk/search?q=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAq0lEQVR4nO2USwrDMAwFn0vvZR1NvtnzydRN06iNf4FAoGg2NmIUy4oSIAiCILiZ5Pa26F/qPX4jJEESqjrMXPUAQFW7/qEDZoZSCkQEAD6r8095JOFXEfFuahaQ3mG/bxUw8/yhHdKzFd0Sa629xCUv54xSyvAZhxkA9jZt763HzJtdoFvAVZCEiHwN3mhoDYB5SNoWx/5ZnfJU1Uj23Pv/AwtOEARB8Oe8AEX8nWWaRvY7AAAAAElFTkSuQmCC",
      blank: true,
    },
    {
      name: "Economist",
      url: "https://www.economist.com/search?q=%s",
      favicon:
        "data:image/x-icon;base64,AAABAAEAEBAAAAAAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAALEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/CxLj/wsS4/8LEuP/AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//w==",
      blank: true,
    },
  ],
  mine: [
    {
      name: "Can I Use",
      url: "https://caniuse.com/#search=%s",
      blank: true,
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAADAFBMVEXRa1hIvVUBriaErG7//vzQx7e116nq4M2Dy4FmYktwx3Tt48/y6NQXsTH+7uK2fGBhwmhoxW7Wg3HEMxe8EAD78Nqn0plRvluZ0ZLKQizNs6qupZZ0zX/9/+3669vM5cUxt0QlszpQqV6HhoPP3L1YwWKYooEQujB9ynxWUTgly0Tp38yhlIhAkEAldSRdOC706tbw5dL/8ezInXD169iK1JO7u6n+9ODAJQSY2J+Wrc+z4bLluKpnkcWbyYz/++CMzYcAqQz25dd90Yn90/ll020qwEPk28j5/OjhueEstkDfoo7k2NP+68n/5+CmSj3i2MX85dI6ukzx+ufhqp7+8/r39er29uP77NU0kjgvvEQ4LBc8nEFOzVqQvY0evzvN+f/m+drt8uHpxbnb5s7s7dpwomfb0cA3p0Ti7tfB473n3bzc7dDe3szr//9SZH0Avij37tng1ssttT7dk4Xf4t6U4ZOm3Kh81ntaelrv6Os/WC6I3Ik+iDvuzr/z2M6AgICBgYGCgoKDg4OEhISFhYWGhoaHh4eIiIiJiYmKioqLi4uMjIyNjY2Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7////XnzsNAAAAmklEQVR4nF3KQQuCMADF8U2EQT1hklJCQSIhbIdCCtepRodgpxB26eKxj+ChL99mhOm7/OHHI8AdD+AFeZzXRXEhTLKKSuZyYD49xFM4T+E0hpttprAeQ2x5YAZYJEsb6KgHHweN3f6DSnL/iLTa/B5lWOq21SpMdZum5Cn4nguTi+ydCWMEAVZVR/mOAqAd8AWgBz8H12qGYR9XXh8E2WsxgQAAAABJRU5ErkJggg==",
    },
    {
      name: "GitHub",
      url: "https://github.com/search?utf8=✓&q=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADLElEQVR4nM1Xz2sTQRT+dpNScqhJW7ZJ9mx706RJ0/SHbRHR/8Cz9ORBBBEUEfwjBJVePHhQFPUiIi09SNqkSbtJU70p6dH+IOChQmpNss9Ddqezu7NJmgT0LQPZN/O+75s3bzI7wD826QxjPURUawtUktrGbWfggK7rR3bnxWjc8v51p+AIlGVZBkAdC9B1nQXbCZuZXYwsy648bh1yvV6vA8D9Bw+xvLLSNrlFSPFUiMfjEXKJnJ5arVYDgMj4REfEdvtSzAMAvF6vg8/hqFWrBACRWKIn5EzEttYQ0ddn4bS8VE3yHs3cIaKYR6VSOfD7/WHTJ3P9YSJykCuKgp1tDTvGDNoxt/FEBJ/PF+J9LAMnJycEAFFb6s9CbDc7Fo/X398vAYDX8A+ACJH4pBOFmm7jpiaMtOHJAPD7+PiIiBqdthaJJUBEHbVmeKqqjjEBLMhQzbdifrNjAcX8phCTiLBbKn1jS0BEGJ9IOrJlkndlgngeUwbQ11AsylhnM+fbtpZzxTUF+BrpFzw9ECDCXrhyjQlgSyAq2a7TDyC1tu7AHvT7LQKO+ZT0WsCdu/ccvvdvX1uWoEq6LlyC8cQUSNe7a6LH6DMFgIhQyGUE+6W7QoxNzjTFtAhwK8RYcqYj8pu3botnbxR3YGjoPBMwODx8jhWi0fLZNPsdT84inpxti/jxk2eIJ2ehaQXh7PPZtDn7XYA7jH6WywQA8alLrFgKuTSm5y7jT7VqKaJCLi0sOD7WzczYIUWRWAYMh0oAVpc/WgA31j87QIR/ry2pgXwuDeLIgdPTEAD2iQgBbo8CjfrQsutWAS7bs9m2fffmJYgINxYXr/N+xydZ+fCQACAxPcd8dgFuxsfYzcRQgkH3TzLDPOWDgxoATMzMOzpfvXiOsdFRIYlo/OqnDxgMBBrkoZCDT7Y7ANSVUMhDRNAyKWiZlOUk+bG377oD7KeOlkmxJRWRuwkAAH0kHJbM4traWMPWxhoAYGF+rmURmuMJwNOlpUcj4fCZLya8DRzu7TmuZu1YUFVbXs3cMsDbr6CqSkFV9X4vlbJuszfbhWj0qjFeakX+X9hfKwNpwLLdyLQAAAAASUVORK5CYII=",
    },
    {
      name: "w3c",
      url: "https://www.runoob.com/?s=%s",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACHklEQVR4nIWTX0jTURTHP+fu59xUCJLGCgp0IIPSIvLPg9JTvZq+RBj5WJGySWVPKSH0ZCSWD/ZiFAQVqQUVBulbaQT2IkVEUhISPrTptE23e3pYm26t+sLlHrjnfL/3fM+9Qh4Gp5ubVOSmqlSLIACqGkUY8bp83acP3drYmi+ZYGSq3RP1RudFxJ9PmgOVU6GG0bs5BCNT7Z7lkuUVwPlncZaEi6GGsf4swcD0sUW14p954S6cryAoKoJ/j6VybxLEHAzVPZp1Bl63HBHB//2bYe6N2dLUJhqD68xKgANflpj7GCewL4m1qQnAJwPTLZ9ECJS7K2ja3gFogRuneRX4mYowsdSHIKRc7HJECAAYceEu2rRARECV6Ooa28pKUU0Tp0xRNseVpNXkqxljeDz5ig/zC0RiqywsLnGhf5jYWryQO00mv/j4+T6qqyoJVuzm3tNJaqoquN59ls6rN3j/+WtuubDgqJIQoRjAWsv9a5eZmnmHqiWyHAOgd+gOw71duIsc1lKRTUExE0aE51tZrbUcrq1h545yzp1oJmUtPWfacvzJoLN29KWzXhw76U6UxRJ2BSOu7GGZtyQnOTNdVft757YImn5IMy1XBHoKjfAP29JbPFw/7gUwAOH6sV5Fh9I6/1vEExvWl/UhE4TrxzvUchRl9a/qyoMfdftLLzU+WclvLQeDb1uDNqltiAZREgIPPY7vWf5XBvgFMS/Jw/yUPqwAAAAASUVORK5CYII=",
    },
    {
      name: "GreasyFork",
      url: "https://greasyfork.org/scripts?q=%s&utf8=✓",
      favicon:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=",
      blank: true,
    },
  ],
};
