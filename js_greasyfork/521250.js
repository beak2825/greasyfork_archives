// ==UserScript==
// @name         豆瓣电影跳转厂长资源和片库网
// @namespace    https://www.czzy77.com/
// @version      0.0.4
// @author       Loliking
// @match        *://movie.douban.com/subject/*
// @description 厂长影视是一个在线影视网站，片库网是一个影视资源下载站。安装脚本后豆瓣电影标题旁会显示logo，点击就可以直接观看，或者下载下来看。

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521250/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%B7%B3%E8%BD%AC%E5%8E%82%E9%95%BF%E8%B5%84%E6%BA%90%E5%92%8C%E7%89%87%E5%BA%93%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/521250/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%B7%B3%E8%BD%AC%E5%8E%82%E9%95%BF%E8%B5%84%E6%BA%90%E5%92%8C%E7%89%87%E5%BA%93%E7%BD%91.meta.js
// ==/UserScript==

(function () {
    var host = location.hostname;

    if (host === 'movie.douban.com') {
        const title = encodeURIComponent(
            document.querySelector('title').innerText
                .replace(/(^\s*)|(\s*$)/g, '')
                .replace(' (豆瓣)', '')
        );

        const subjectwrap = document.querySelector('h1');
        const subject = document.querySelector('.year');

        if (!subjectwrap || !subject) {
            return;
        }

        const sectl = document.createElement('span');
        subjectwrap.insertBefore(sectl, subject.nextSibling);

        sectl.insertAdjacentHTML('beforebegin',
            `<style>
                .cupfox {
                    vertical-align: middle;
                }
                .cupfox:hover {
                    background: #fff !important;
                }
            </style>
            <a href="https://www.cz233.com/xsss1O1?q=${title}" class="czzy" target="_blank">
                <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">
                    <image id="image0" width="32" height="32" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                    AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAK
                    rklEQVRYw62Xe3Cc5XXGf9/37X2llVZaaSXrrtVKsm6WbEsCfENEwcYQ34DEYEJDScMwhE7TNIF2
                    2tLSpLQxDiSDZ8DEUxLGLRMCuNhgx4GYWyQsy2BLqyLJ1m210l6k1Wp39e199+sfkh17SApkev4+
                    c57zPu9znve8Al88DKjVTRj0a5GkYhRFJJGYQY68C4wAmS9STPgCuSrM5m6aGr5FddUGLPn5CIKE
                    fwHdxbF0ZnJyUggs/sKQSD5vzTK5hwPzn6uo9LmyWlsgnb6DW7a+QHdXGxXlRkFArAwE+VpZBX+/
                    9y4xoNXkBTKZLbuNeTe45NDUXDQyBSj/Pw14vAZamv6d1jWNBo8Pm9NFasDBz/Z9nb++/5vU2u2E
                    g0FenfcJ92iyy7atqtjuiciZ6XBwWCNJ0bTyx/sQP5sjCaCyKBJt2SfH6Jr1cuSBBylSa7gwPg6C
                    QCaTodRkQpJEepQEN5dXW76/fsO/thQWvyFotfcA+j+VgSy7zbbZkJf3oL1+9fU/P/BjsbKkhPXt
                    7cy4XPzy1CkKDEamnE4ePnaUeVs1ytwcOwQtTQVWSRHFUm1j3Xaj0Wh2u929QPxzNbB9+3Y8Hk/b
                    7t27f/rwww//XX5RUbvTPStUFxULwVBIESWJmrIy4bmzffzOOUlXRSWvz7qQq6tI+he4bSlBaXYO
                    AVnmE7Wo2nrrbet7e3oMiUQ8CKwVRW5geQA8f2gKpLy8vI7b9+x5vqh4VaMoSARlmcVQUNGJEn7/
                    QqqsvEysr62TjvX3MRmNclOBlTcdA1wsL0EVCvPAxDQ1Jj2joVmGotNs2GwjEbuYKCuMx40GdKo0
                    6jfe5v1f9bBTdRk1L8dEJBpdt7at7ZFkRmkfGB2pVAQD9959P1qdFhRBSKRSRKNRtd8/TzDgYUtl
                    JW1z43hnztIkD9M29DbmPJHNXUmqS2FnAZgtoDM50OrRCAIaRIi54MKHpIDUlQYWgiH1nlu2PvrD
                    J/7tjsCSzO5/eoxgOID9zIcUmLMJzV8iNv8JojxGgeSmXLeImInQN5Fmehz8EVBLEM7ARNJEdUGY
                    8gYFSWTZmi4PQgTGB+DMGKenniCsuop6tb2qylpVXY0w60avVyGkzjNz4RUkSUCTilCfp7B+NZRY
                    YSEMDx2GV89BIn2VarMNdO99nFfOOxh1Hubu7VeNYBoyXnjjHJ7ecY6ufgxUHR0dFBcX12k02gci
                    iA3PPneI0KKTx697m86GFL94Q+LZNxXcfgVBgPoS+Okj4A7Drz6CVPpaAS2Fw5w4cZx/fvyHPPvk
                    KW7b5MSUtcJACAZHJY5dLFUJKp8hqaQQ+/r6DGvWrHli//4ffefJp57K37tvHz6PRymzppTfnIW+
                    qS7CGStyHJZi0D8Gj70AL74JqdQfnt3R0VEMBh0ZqYz5xRW9RyDmh+dOZynb7nzQsqapbk8ikUAs
                    Kysrqaura83S6XjrxJv0v/tbbMW1wumPtwgne/XYa1cTi0auARgahrnZP24eGzduRK/XM+uZW2Yo
                    DgTh2BmJF2LNQlCEzo6OTkEQskWbzbazsbGxxGyxsLHrJuS0wpTXy667/oWLM8UY9FoymWsfuI4a
                    +MFdkG/8NLhKpcJqtXLo0PP4PGNkZwEJmB6FnwzY0W7byXgoSFNjYwVQJMqybAc0oiRhMhq5sbMD
                    Y44JrTkPnZjG7Z4lPz//GpDOZti8Af5i87Lyrwb/3vcf4cMzZ/nJUwfY05WmKA/IBo8JIjkFFFuL
                    8CmQk5NjrqmpKZVsNltVV1fXzaVFVtEzMcaxV19hwjPH+s5Ozva8RW/vGbLNhZSXlxOYm2VbG3z3
                    PsgvgetLoCYLNBIYNKCRFFKyH210im9+SeYvvwE6PThGoCAfrKKbFz/JJawIdFkKcDqdJ1X2Gpu2
                    rKRERKWmqNrGlo0b8YRlAoEgd94ksLNqkYHxCNWlGvzFWkoWGzj+0gJb75mivh7+rBTuDcP4BMhx
                    hRzjECYz5JaDoFtmpn8Qrm+E3ZuS/NfPzzGQ7EQQRbXZbLZKSjLhl9JJ+5J/vjo04xJ8Hi+BeJKT
                    //0iX2nr4dYvp7mlPU1re4KpwXKuX9yEZtHCQukwtXYFdLCYgWdPwPlJyKuAklrQGVbuJQGTA+AL
                    QF0tLCwoDHoqaS9ZpQwODv5aNTQ8MvLdf3jsO1+9fc9bqvz8Ek9RISPjkyQiKb7kFVi7DjDAoh98
                    6TCHnQOYzAl2WODSOPQOwjv9YC+DB3Ysa2KsX8AxoSFHmyaZ0NM/kiKsjrLlJrCYkmgSMQRIeL3e
                    GVUynQZYaGpqXuwLh0oulVdQ1LqW9MRFcrI+WD6FAtk6sK/z40suMRpM8sFAGqMezCZ49D6oLgNJ
                    hMH3BE5Of5312+5l0e/mo48ukHODlputT5JviTM+r6FQb8SUlRVwu92XLltxeCkS8dYVWhvdgkQs
                    lSbuGaXquuiygylgNMBXtyrc3h0jlQRRBLWa5ZVmJYclGBwrZMf9j9DU1ABA6apSxi9N4Fms5CPH
                    CP95vpA7NjYwNzc36fF4XCKAoihRn883aLdYmLw4zFBgHoM8QZFZ+f0joiw/KpIAWu0K+Iq/X9mD
                    UyApKvRkYGUNK8wx4Rm/xLtnDdx9pJa4qYUb1zRz9ty59xRFCYgA3d3dDI+MvJOXlRXPn5mF0BJ2
                    tYfcyx5+dQgroCFIzq/gXN4qNGDRL+IaOk/a7SLhHEe1FMZx4QOmJyYZU9Xz0I1biMiy69SpUy/Z
                    bDZUAD09PUSj0V631/s/O6tsbfvffY/WNg8q7crpLgMkQVkAzyU4cVbgNx4LHZ0Z9m5YoNiqgBZa
                    q2WO9h5CrdFiys7l/fd/TXfjeVJCmKKlEra1d2QOHjz4nM/nG/D5fMsrWSqVwuFwyE8//bT2zl27
                    bg70fyhuaxxidc0KA1GIuuD8GTh0Uqv86JxdeMnQzfymu/md1MEHH4uoFr1UFiTItUC56GRq9BTT
                    k69jKzpN3eoELnEvO3f9FUePvvbKgQMH/tFqtUZlWf79x0SlUpFKpSz3/fn9v6yuMHd9ufpJ2sth
                    fAjeGVDxmrOAAV0D+sYN6G02nEqC6uxcvFGZWCxJhd9La+B1vtHwMdetTqLWQDwGfSNZzEnfxt6y
                    j6NHXzu2f//+B4uLi2dGR0ev3OiVyM3NJRrPtNdX6A7fc0Og2Rsw8/J0FtPrujA3rqFy1SoMajUX
                    F/3IyQTNeYXMyGGccghbbj4WRYXieI/GmZeoz11AyFpH66ZHySuwKS/8x+HXn3nmmW8XFha6vF7v
                    FcxrtuJYLEZZVnx2xCW/MzCTX3zj7X9TV9fSIYSCIYxqNWpRxBeL4FoKkas3UKAzsBSPEQgFCfvn
                    Uc/PoczLJP0FtKx7iK07v8fMzFzgwIH9B48cOfK3RqPRHQgEPqXpT4UoimQymfyWlpZ7d+3Y8S2b
                    zVa7IMvidCDAsM/LdDiEoFJjVGuQw2Ey0QiV5jzW19TQ3txMWWkpc/PzwePHj7//8ssvH3S5XG8v
                    S/jT8ZmfU0EQKurq6r7S0tx869q1a5tqbDZrTk6OWhJFUuk08Xg8E4/H4/F4IhoKhzzO6elRh8PR
                    73A4Tk9MTJwHIv9n/c9q4KowANUWi6W9vLy8ymQy6bVabTgSiYR9Pt+Ey+XyyrLsBOaAxOct+r/o
                    jZSekG/KHwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0xMi0yMFQwMTowNToxOSswMDowMPdfDw4A
                    AAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMTItMjBUMDE6MDU6MTkrMDA6MDCGAreyAAAAAElFTkSu
                    QmCC" />
                </svg>
            </a>
             <a href="https://www.gyg.la/s/1---1/${title}" class="gying" target="_blank">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">
                    <image id="image0" width="32" height="32" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                    AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAq1BMVEU7iMM7iMM7iMM7iMM7
                    iMM7iMI7iMM7iMM7icM7iMI7icM6icI7iMM7iMQ7iMI6icI7icI6iMI7iMM7icM6icM6iMM5iMI4
                    h8JFj8aNutxhoM5Ikcfa6fTu9PmqzOVfns7a6PP////r8/n//v9fn87///7+/v/+/v7//v7+//5I
                    kMf+//9IkMbt9PmszeVVmcutzeXs8/mrzOVgn845h8JIkcbu9fmOutxioM6u3PGZAAAADnRSTlMG
                    Ztv97+9n2tr8/fzcBlfjn3kAAAABYktHRCHEbA0WAAAAB3RJTUUH6AwUAQ4R2bl5zQAAAk5JREFU
                    OMs9UwtbE0EMXCgiIuYdioLa87jbnhXxrf//lzlpC/2u99jMTmaySWsnpysiYvxEWI3Uwx1flrw6
                    PWnt5EzYsKxknJYRuFRDcXfjF+ftpYiJUbK7gyI8lImCIzxD/KK9wmIweaQmYT+xBFmK4RWAy0Za
                    q6GZqsirAkFiCKsZSB0ANiG/XmstJamIgCyxyuKuLURZ9ObtO18rcgtIDCuU5lDO1Pb69fbu/YeP
                    gMCGIW6OB1nAbNNgpL/dDMOngqQxVHnCMf6w1OqdCzAW5N7XMMkBpWCDYG3giTwApiOLVsWQKRO7
                    G15V94C5b58hhchKYq2M7VMsc5/6vH2CwGJWsoZjgO/PAAzDNG3HeThqgWlxAChR2ALME2QufTf1
                    I8s1gVqbuIbpl83Q+3ae52nqvS99GB6+PqJCkq1Obq+hjxOiy64vywKOh2+PipBVJV0KgO3LNELn
                    BC/ff/z0X4ZjkeaQwAfAuIBlN1b4vmpahwmbauwF2E4dOnaH3fDAmshQGgSlqDqM4zw9hdEcSB3s
                    AKgfRWLzkVydEu2H1iKU2qClAM+7Bc0AUkeFmVBJcZzZ781TGK1cHYJCCwrp0QJdiMO6+1PhDGiv
                    /MiufNBQNKw3f/8dyKufE6yFlHo00QRGdJ1QVUsYEEaKcMKnZgtCqUCLXRaOIUlMXmKIvFrLqL1m
                    MXX4IriLZAwWoxnMGUI4LtsF7hgAqhlwTAz6GmPsUanAdYrhhWdFMtvPrVdIAi2iAVVn5xjvqxVa
                    HSMeNdywDm63isfq6vzNf9zoVyGZI73cAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI0LTEyLTIwVDAx
                    OjE0OjE3KzAwOjAwiSzArQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNC0xMi0yMFQwMToxNDoxNysw
                    MDowMPhxeBEAAAAASUVORK5CYII=" />
                </svg>
            </a>`
        );
    }
})();
