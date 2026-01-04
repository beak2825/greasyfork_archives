// ==UserScript==
// @name         扫一扫
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.2.1
// @description  haha
// @author       CYF
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @match        *://ml.corp.kuaishou.com/label-frontend/tagging?*
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482254/%E6%89%AB%E4%B8%80%E6%89%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/482254/%E6%89%AB%E4%B8%80%E6%89%AB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    // .container-main-body > div > div > div > div > div:nth-child(1)
    // .container-main-body > div > div > div > div > div:nth-child(2)
    // .container-main-body

    // 更改h3
    GM_addStyle(`
        h3 {
            // height:210px !important;
            height:750px !important;
            width:1600px !important;
        }
    `)

    //更改图片
    // GM_addStyle(`
    //     .panel-wrap {
    //         // height:210px !important;
    //         width:1600px;
    //     }
    // `)
    GM_addStyle(`
        .flex {
            flex-wrap: wrap !important;
        }
    `)
    GM_addStyle(`
        .flex > div {
            width:36px;
        }
    `)

    GM_addStyle(`
        img {
            margin:5px 5px;
            border:1px solid #bdc3c7;
            color : #eb2f06;
            object-fit:contain;
            height: 350px !important;
            width:350px !important;
        }
    `)

    // 更改query文字
    // GM_addStyle(`
    //     h3 {
    //         font-size:18px !important;
    //     }
    // `)
    // GM_addStyle(`
    //     h3 > a {
    //         font-size:13px !important;
    //     }
    // `)

    // 更改按键大小
    // GM_addStyle(`
    //     .item-button-span{
    //         font-size:16px !important;
    //     }
    // `)

    // 更改id文字大小
    // GM_addStyle(`
    //     .desc-panel{
    //         font-size:10px !important;
    //     }
    // `)

    // 更改分类文字大小
    // GM_addStyle(`
    //     .category-desc{
    //         font-size:10px !important;
    //     }
    // `)

    // 更改分类文字颜色
    // GM_addStyle(`
    //     .category-desc{
    //         color:red;
    //     }
    // `)


    // 更改宽度
    GM_addStyle(`
    .container-main-body > div > div > div > div > div:nth-child(1){
        width:1600px !important;    
    }
    .container-main-body > div > div > div > div > div:nth-child(2){
        width:1600px !important;    
    }
    .container-main-body > div > div > div > div > div:nth-child(3){
        width:1600px !important;    
    }
    .container-main-body > div > div > div > div > div:nth-child(4){
        width:1600px !important;    
    }
    .container-main-body > div > div > div > div > div:nth-child(5){
        width:1600px !important;    
    }
    .container-main-body > div > div > div > div > div:nth-child(6){
        width:1600px !important;    
    }
    .container-main-body > div > div > div > div > div:nth-child(7){
        width:1600px !important;    
    }
    .container-main-body > div > div > div > div > div:nth-child(8){
        width:1600px !important;    
    }
    .container-main-body > div > div > div > div > div:nth-child(9){
        width:1600px !important;    
    }
    .container-main-body > div > div > div > div > div:nth-child(10){
        width:1600px !important;    
    }
    `)


    // setInterval(() => {
    //     $('.flex > img').attr('alt', '裂图')
    //     let a = document.getElementsByClassName('category-desc')
    // $('.category-desc > span').html(
    //     function (i, html) {
    //            let a =  html.search(/(\d+)/g)
    //            console.log(a);
    //         return '分类 : 参考图片<span class="number">'+ a +'</span>张'
    //     }
    // );
    // $('.number').each(function () {
    //         $(this).css('color', 'red');
    // });
    // }, 500)


    // 红底白字
    // const errorImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAvdQTFRF/wAA/3Bw/////9fX/zEx/0BA/zc3/9XV/8XF/9/f/8TE/93d/zMz/x4e/87O/3l5/5OT/8DA//Hx/6am/83N/3h4/0ND//7+/5iY/x0d//Dw/+Tk/wsL/wYG/9LS/0RE/6Wl/6Sk/2ho/+zs/xIS/0lJ//v7/3p6//n5/z09//f3/zIy//X1/y0t/zs7/11d//r6/4aG/09P/1FR/wgI/6ur/zo6/52d/8jI/xMT/8zM/1xc/0JC/+fn/5eX/wQE/62t/wUF/42N/8fH/5aW//z8/ygo/+Pj/y4u/19f/5KS/25u//j4/1JS//39/+Dg/7q6//Ly/4mJ/0hI/y8v/5CQ/8PD/x8f/0FB//T0/1pa/2Vl/wIC/3V1/zU1/+/v/1dX/4SE/xUV/+Xl/ycn/+np/1BQ/wcH/7Cw/9vb/wkJ/4iI/+Li/2Bg/zk5/xgY/2Fh/+vr/5mZ/5ub/wwM/0pK/yIi/7+//01N/4KC/+bm/yQk/9TU/3Nz/+jo/yUl/xAQ/39//8nJ/xoa/xkZ/4yM//Pz/7S0/0xM/6en/yMj/5qa/3Fx/2Ji/5yc/46O/z4+/4eH/9DQ/9PT/7m5/1RU/4GB/7a2/2Rk/8rK/w0N/5WV/8LC/4OD/2Nj/6Ki/2tr/zQ0/xYW/+Hh/9ra/2pq//b2/wEB/6mp/wMD/yAg/7W1/xQU/2xs/6io/4+P/319/zg4/w8P/6Oj/76+/0dH/woK/7Ky/3d3/8HB/6Cg/9bW/6+v/w4O/56e/yEh/7u7/ykp/yYm/4CA/1NT/3R0/yws/xcX/4uL/3x8/0ZG/4qK/7Gx/7Oz/3t7/7i4/9zc/+rq/9jY/yoq/3Jy/xsb/8vL/xER/6qq/97e/2dn/+3t/2Zm/21t/7y8/1ZW/3Z2/+7u/xwc/8/P/5+f/1VV/2lp/6ys/8bG/35+/zY2/729/29v/5SU/15e/zAw/1lZ/0tL/zw8/9HR/05O/ysr/7e3/0VF/1tb/6Gh/4WF/9nZ/z8/i8ZznQAADjhJREFUeJztnXucTdUewLd1uXkUM1PMwxi6RB4xGJUQ0iRhxnjMeEwmjzEPMqMIeY0hVBRi1HR1SRnDUNwoKnlcKnIHN6WHHtzciOLW7d4ef9zz3Hvt9dhnr+M458xav+8/zN6/9fus/f2svc/ea6+9lqYBAAAAAAAAAAAAAAAAAACEH9WQhz+EuiZVAJAlgISyqtfwjz/6zKzLuiYIhxEcaiL/qOUzs4QtC2QJALIEAFkC1PZTVh1P+Wu9V/zryMxwgadaVl3vhnpkZglbFsgSICKSIEr3Qe4xcb2n/A3e6PpkZglPQ5IG0d5jjLEVr1TLIoiN8x5iw3hbBRSW1ShBPwkb2yuhsKwmuqsbbZZQV9afdFdNm9ksoqysm5ojW7TAyqgqq8HN9lyBLE1r2cqmK5CltW5j1xXIuiWOLQZk0bQVcKW6rHaJAq4Ul9UeMxHBe0XRQQ/piBVV7UE6qRPebG7lhd3mjbgd36qYrM53mM6x5l3YYV31CNNbMLVOw5bdyEvSnd0ZYfENvbt7mLarJKvnXdGkK4R6MR4M7/buTDZ3tisk654EUpSL3veSgX30ffeZd6gjqy/vCadfR3Ng/xTvnlSiT1AZWQNMgtJMfw3EAwfpm1sNJnIo82s4BLeTnjF0GP73ACNuuLF1BJlDGVmZvYzz7v5MTRuZZVhJfkAPG2Vs7UTlUOY01EaP8RxPwj2uv8dm667GeWNycg1XeflUCnVkadVdz4Qp43t6/s6YQLoaXddw1TuDzqCQLO1Bx8GkTjT+LshzHl5z3VXhJGtXSsnSHkIPT8b/buY4+uZTPH88gr/c78ZypZYsrQHx9+SpaJrnv9MxVejRGczi+oMl/9dwZoBrHFa4+x3iZ43BXc2eww5W5tbBgqK5TXFVqHgeJ1Ct05DF/McWmFShIayOCBeKy4ofvpDoZE6bxo9WWtaix6mH64QnLOKf9A7YGk7uWSz3NWv+kk6MlzxP5fiX7WmJW9bSZctpUQg9Y3PoEc0KOVvWjJUlq9JYptCkZ/1OukhP8lwAqxpSSkc8/2f+e/vV9kb/eXnhL8vWdFhb4Pxv9SeNLAN8lasyPMo1lTX9RcFcSzwl1/UytdPHr0rFQ0ELjqqXXqa7Y3wxkZ2q5CpUOzQUrWcdX/q4Mj9yxbNl1Qh4pUPG89TBJW9Y62euhgxVaEx5QOsbUjaaXxz22zSiwu9cK1iyNgewsiEH6zZO2/LAZN8F+LzCcBXJfaysiiz1HNXUV1v6Dm5831aLvc8yXG0LWEXDAsezcM3VXZN8xsX3/2uW9f049XP4Wp/AVTM8mLh9h++giiWvewRQvXwYo0c+8EbMipfQgt7P7NxVb5Fkrco2eocL6rcx1HUJezLfNC5Doa5L+NPWuBJxhrsBBm/pspq+Heq6hD2x/XRbu0Ndl5DAvOW+KqwI9aFeOSBLAJAlAMgSAGQJALIEAFkCgCwBQJYA99qY3e9ZfMS38XojV2yOQOqbDSkZh48+WrRa/2/iO6GuWfjxMKaqVWOtyGhme6yKlewNUv3CiH0zMVdpIx1b9ht//41fLgL1O5AZtFqGB4X45Sr7oHNTvPEVxqR3eeXec+6uSU1sJzP5G/Cfswmekd3vG5vSOa+tX3XvjnoweHUNNYcm4K7yCjybsaaF9rPKlR3W979ud/qfKk7sB7gqlGAcdqGxNborXbDnEfzU3R7EKoeKRn83jxcpxl9UVxrbs/aRJYtux8slUyNN5aPlUZMqtML0BrbimLFnzHxzydamczeN/HxDPgq2mFWhHsQ4mEPYvuOmy1J90wxc3f4RzGqHgvIPyeGlu6iY3djeusbr7M7mR83jJ4JZ7xBQ/uBLhCoUQUftWIft/+hjz9a2s03lIiV/YVa+hLhYIc7Qhon4oK6jrrvPZjEppnInpRpqRNF9xCeUKpTGjv0Ujzk2WMt8+TNzufbBrXuw+XwdYhDHia6PBw07RXxwcKxDUKseZHqumYCYcFqWpo1nx7tY9TGvlATknGIOnbWUpd3JKxIn3Qg2jIzDk3jHbSVLu55dYup8fpEqTveVXzDmObIlq+xJRnybU8Gre5DZ2H4244Adh6z/L8qq+Gaq4Efsz84l4MtK6mCdtBoyz5iszVKWNmgYUfYrG8NTqyLTxyAWUeMrsAkIfMjSDpI/ol+PGh2c6geXV1mqsg+UOvf5lnXa8++7N1A5HpLxvc8H1GGu2+zpizFksS7wmbeOvwZ5f/NyjlBpUo5M8ec7qbAm6Yz5GI8X6o9zFrJ29P+nqz9rjXdD2aeMr2BTW4h+rBjuFGC9eOjMN9i7K56s+WdXeUeWfmFsPb2HtoUSNwwN0mEEibX6mNr0m0w7mLKu3Y9ND4WSS7H4LsRjtJs6q6le56rMSvdRVS4ltlOyGk2JIZ+I2uEFXqQvgC7qHuDNy1IFWea4HP+rOrXZLKui8C3yfgqRk7tq/dm3tyi65ofSfL+Su2ssY6shK+6WFt+yLbQhviN7ey57ugMHZ87JPIjmDt5hY0RSDaaoPfODaxd1xp8PxYEEA1+yFnRqx/w8ruIxvq48WfuZLWWNufOmntyS8yN4a6xM4Zap4vBlJaz29Wn+i+eYD53yzBtCwpbV/LsLsXZKd18ZSZVNtJpXqmrDmEdkwckuAl/xHrxIzHDz3tWrbMhZYz7U3s9v51+m2JSeOo4lOHZFUyCEO98bnc3LS1r7l2PkwDreHC8EtnbhRkfXxH+JX5y6ohELP4xyta8zgapVuFJjfdzjlwIwXuHg/pnmNUKkJHCPdLZ+QwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACCjVxRYM8BP6k/UqSU3ml4WBpmaoDzMwgCwBQJYAIEsAkCUAyBIAZAkAsgQAWQIYsq5CcpAlgGyyatuQdYmcuM0ueu7afiYIM2y0rL0IJRY/vbKAG8BFwZY11ROQ2kQ0uXot67IecVI0uWwty7esPG9AtPCahcrJ+lwPyBVOLpssX9esHcaMmhv2WzKRLqzaNSsG2WUWXVi2luVD1jjbrkDWCe48rSCLpKzYvivlZY0ScKW6rLaWi8yALJzO3URcqSCLf59VWmyIWB7JAZPVmE6u75PkPosrqxRfiZa3mg62ct/1jN2yyeKdhvGmVXsr2ZPfLk3WI+JYS0bLdhpyZOWbXCGUypr9fkaUEbCElVwNWfnpiKDfl1TRolrG7p3M5ErIOkEshOkigpj8vju2XEMce5k+FWT9uynDFUK9zB3LTYw90ZzFtRWQ1de0cjbGMWzW3/IbsR2rOcnll2Van3xEX5Ouvt6gUvzl7E7eymCyyyrAFxmIq+G4Pfgat7XFvX5MRh62LZu7XK1sssibUnzG+09cS/JsnInb+jHDsaltFrYlir+mjh4j6U3pE8bqjulF7k3xubitrEPaSnwBlAUWM+vL3rK0ed6GtNsImo7bQqZlwdZbTfUue8vStG3Fzr+i38CjfiKW79DJ/sEquWwti3HrkHQEoTaXzWH/YS9g/oz1mtEKyNLKdjW8hYxrRi+lg9CefOvksslid9F0ZkTSKxj28JVcj5T2msVmeyWjj3nANOuFamVrWbZk5X/6JvOShVCdxVbrp6gnK7PrbXEcVU6G3T2Hm1w1WT+8R67FStNrcwW7sFKyYuvNZMmhSf65HWsxMNlkcV9YbPspIoFt5rMo5uZNZ0+TyfV9Mv8axg86fEcKpxGlXtixo1oqe1/dkrWmn0fZWhYpq+i/9zeZmcwy4eLM8HJnVPmlupyAprmzzpd7k8smy3QaLt3EXCFUZ+Eho2DjhdywNt/NbeC6t9e3yHgabptkYSp11Axz0RmvfM2P7u+MkK1lmU/D73nHnrZ7KONmPacd79Mf96sxuWWxv3tKrvxfEq/82IusO1bPwGbJZe1LJI+72y+Xiiwz5C95jpIV494luSztMH7MiZH1sc69E3Xu4izJPuf9H02u0orc22WXlaT38tWKGRdvCt3l3DjwWnaeJ1qcMWQt9myUXZbW3/HfdW+dm0atWzvHc5t69NfB7FSxZ4+4e5/1Ve5lk0U/7oxozBo9pGnYO57fSg5y0m0fUgtb5V4vIMl9lp3vDV3caroqoWvO8dZnH9tH/69ssmx/yVobkfzYwtd6wLKdhnZlXaZcObnhK6qnAUdRWWW/MWU5KJ41j1tKNlk2r1mTS/JYptzUrsYpZUQEvuKhwP7X92uf5nZJVHKKyNayRKYqyBz6MLuf4RCngMqyHDTqsGE95eo4L1pxWQ4md1lFjKMs5IXKJsvnBX7tReIR0UGzs3hXzmxucj1ElQv8JrLzwU1sfb2j4X1uctlali9Zg73N55fh5CPj3l8/ce65uYibXDVZPxunW8rOzeQUKxMjsr0dfSxkk+XjmrXVfClHtReT9+uHHuEnV+yatQKRRH+72PJ5EEe2lmUt6zzlysXtB66zlVwtWXvYshy89k1P38nVkvXOgXTemAc0+9dYX8nVkuWgWWEub1x3ysLLmZbJlZPlIGfabdkcX0dfthqwrKIszWqs5KS53O+cVJXlIKdjp1ZMXesvZnCKqCvLQWmfAcyhW8kb2EsJyCbL9qswDwUXipnNaysrWN+rxh08i7EX6YmitjAjZWtZfs2AG3+WGMXM+ZgVZLn5/STeXTqIHQSyvJyO0H8cb+SEgCyDdw8vcJ+EpZwAkIVTVJLFPwlBFklp/WO7uDtlkyV6n0WTxP+ITs+t7n2WfWRrWbCGhQAgSwCQJQDIEgBkCQCyBABZAoAsAUCWAMbjjvUKFX6h54bHHd/I1rJAlgAgSwCQJQDIEgBkCVC9hoffr0Ly373J2W/3AQAAAAAAAAAAAAAAAAAAAAAIf/4PK0AFykBeAY0AAAAASUVORK5CYII='


    // 白底红字
    // const errorImg = 'data:image/png;base64,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';
    // window.addEventListener(
    //     "error",
    //     function (event) {
    //         const target = event.target;
    //         if (target instanceof HTMLImageElement) {
    //             // target.src = "https://search.chengyuefeng.fun/裂图3.png";
    //             target.src = errorImg;
    //             console.log("图片加载异常", target);
    //         }
    //     },
    //     true
    // );

})();