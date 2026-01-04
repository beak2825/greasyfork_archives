// ==UserScript==
// @name         Dark Mode for 8591.com.tw
// @namespace    https://www.youtube.com/channel/@Scottdoha
// @version      0.2
// @description  Enable dark mode for 8591.com.tw
// @author       Scott
// @match        https://www.8591.com.tw/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492387/Dark%20Mode%20for%208591comtw.user.js
// @updateURL https://update.greasyfork.org/scripts/492387/Dark%20Mode%20for%208591comtw.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Add CSS styles to enable dark mode
    GM_addStyle(`
        /* Body background */
        body {
            background-color: #1e1e1e !important;
            color: #fff !important;
        }

        /* Header background */
        .header {
            background-color: #000 !important;
        }

        /* Links */
        a {
            color: #ff8800 !important;
        }

        /* Buttons */
        button {
            background-color: #333 !important;
            color: #fff !important;
        }

        /* Additional styles */
        .publish-search {
            background: #1e1e1e !important;
        }

        #leftMenu_ul li ul {
            background: #1e1e1e !important;
        }

        #searchBar1 {
            background: #1e1e1e !important;
        }

        #menu_select .head_right {
            float: right;
            width: 514px;
            height: 28px;
            font-size: 13px;
            background: -moz-linear-gradient(#fff 0%, #f1f1f1 100%);
            background: -ms-linear-gradient(#fff 0%, #f1f1f1 100%);
            background: linear-gradient(#333 0%, #1e1e1e 100%);
            border: 1px solid #e1e1e1;
            margin-top: 13px;
        }

        #menu_select #menu_li_1 {
            float: left;
            width: 127px;
            height: 42px;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHoAAAApCAYAAAD6Qz29AAAACXBIWXMAAAsTAAALEwEAmpwYAAALZklEQVR4nO2cW2wU1x3Gf2fmzOwua+MFG2rCbQ2kQFLFDpUimkC9VhJFSZvYqaKgKGkxj30ppuolL5XNQ9VEqgq0D1ETVdhq04aXYHpJ1D6UNZCGpKWsm6qYcBsDIVx8WbC9Xu/uzOnDzK4Xs8YGfEnIfpK1M7Nn9nxz/uf7X85Zr1BKkUVmT6TNOffew9gZSRGfX+gyoy3dcEhu2r8le0kopXC69qzP/Pml3wonI4UkLLTZZFnEHUGBUqBsLCVkRj795ova6uc/FEopMjvEGSA82xyLmBZYcpuqEuk/1O3Wh46tseMX1882oyKmHnqo8rAdXNslnXMHN8iFS1blheoi7iII6V/vnDtYIXG8xMuZZUZFTB+cjMxl10VF390YNXRR0Xc1RuvloqLvahQV/QXB7CvaH0KUhXEuxhBiljh8ATC7ivaH8H07ilZZTep0lKHf1GFK0D4DK3N6dSNadSP2pzGS7zYhddA+xxNx1hQtQmHMTe1oldUAmCsi2I1REm824LfjExpbVNYgn9jhnqiJLZC5GGPknVswWFkYWVVLJqMYTEBJAMzb2AEQoTCythn5YCMDb9TB2Si6DjM9Z2alvJLrmzDqmhH+ECPnY5z7/TYWv7CTwL21GN87yuAftyFOtiM1xnfnZghZFZl0n2kbBhJQGgBjEgZzvPGwFSSSEDBB6ZPu7jqe+toGAIIv7eXST6sIZuLI2/msO8DoI8+A69aqIhhP7kRf5Ko4eS7G+be2IXWIv9OCfG4nRnmYUONeUp/EGHlvF6qrHS0Vv1GFHt+h41E+frUOQ4JeYFKUf7OZhU+3YDswnIQ5Bhh53kJU1uD0W5CMXz+pPEMrJXAcL7TljZFWFSFzOooQN1enfSHGwL5tzN20Gy0QouS5VhK/ayDom9kQNe0xWltUg/5gI/K+BrR5y697z7+0hlU/3F/wPnNxDebzu4Hd2P3dOH0WA69HMLKu1zOEWVHFPQ3NmFKgFxg4c2Wte6DIGSz/Wc0ndyBXRMblX7K6ltWv3eju1HCcaz+Zh09yU3UKwP53K8l1m/HfG6G0pp7EfxpJftSK37iJx5piTHuM1sIRzEe25s4Hj3cwcGw/CoFAoQkQGt6ZZwylKFkToXRNBAB93nL6D+0mMQylfi9WenyN8uV86ZmWCXmonES57lnTpzqQKyKke7tJ9ZwBAUKBUVGFUb4cOxEncTbm8mT0euJsjGsJmBcEOY4yjUdbcByQp6MM7tmC+f2jXPrbLq4e2UtIc0PBTG0JT7uikwd2kkyBXRZm/qNbKVldS8nq2knfnzjbyaW/7mDkRAcBB3e/1QG9KsKVX9WRGAHbUQghKDRmCoWjBIFlNfgqwqhh6/pn9Yzec6iVS+0tuay//BvNLHimhcTZTk68UofPAD3vuqMgnQHHHo3dYl4Y/CGcC26paD7aDMDIO5D6XwsXXp5HMg1+DaQf5LpGnH4LexIh4E4x7cmYAFKHdmIvj8CjWxnoijLY1cGihmYu7tsOQGW9ezxwtJ0VP9pP33tt2Il+KutbGD4bY+D9Nkr9EPC7blsp8D/ejP/x5lvi8smOGPZZC8e50WUKFAHT9RiGDn5D5Pj7JJQF3NfcdSFyhsmOnVzXmON0eZvA/0kncnE1yTSkMhD0gd9wn6F0y16M+xtwhuNc3l6Fb5oTtGl33QIwdcDwzoVgqGs/0MyCx7dy7Wh7rv/K+hb0OSHSPRZ6sAyAdI+FT0LQBJ+Oq1oF6ZMdGKtqOfVqhNTJDnRtfEXc+2v34dIZwAYlR9tq88I5nlIDv3QNne+Odc3t2y/zrqu81+yxPwS4SebVYShL9COBxNkYSrnJouEZM3lgF8b9DWiBEOZjzST/tI05Yvpq9RlbMMnyDyytZtGzLbnrwdV1AMzf0IhZ4SZrc9c14KsIA1CyNsLAu66BhbrR86z8cXTSHDI2aLbrbrOxMZsgKkQuLChx/bxX2evO+NeBXDWR6O50J5XX2EnE0d1Ocm3tE1GGO/cRqK5n/mNNWH/fhZGwbqtWnwxmrLzSQmFGTnSQsRUKwVBXFIVAKUWqxwLIvQKkrpwh1WOR6I6NDmaB2Hr+zSZS5zsxblJzL/lBXmbvxfnRz3JvqqxvhvobQ0HJmlrWvjGOu8uqOWvoxTUADByLIgWjhBRoCkR+eQYk9jYRqK4HYMF3dtP3yzp0UbhMvFPM2ILJyIetpGwwH9pMLvop15UXhBD0Hmxl4B+tBE3XHIU4Lnlx56Q5KOXZRuUp0ztI9XST6rG83N/Nrs2K5dhDo1l3/vXAsmr3c7w/bXENWiAEwMCx/QQ1kOVh8rvJ9p2FFrcYOtxGcP1mgmsixO+rJ3V8Hz459YnZjC2BagqM8jDB1RGGvIRMQMEnCj3iuvFL7S0EJAQkrkIKcOw91Eb6yhm0m6StC/OVOqa8yqLnwG4u7duO6dXp5U83s7ChhcS5Tj7+WR0+3Y3Vcx/eTGjDFhxH5b5xiQLz600ApHu6sfu6MQKgz/fWDXIzbMyYAMl3Wwiu38zAsSjJwauYGTBvtiJ4m5ilTQ1PzeMkUDmP57gGzhr5OjV4apmzrAa7IowXZSdGXhwG6N8ZYSAFIzbMNd2ESxfgl3lZt+a+Z+rg/KuNKx+0MWJ7yaFy17N9D20G4Oqx/Te4X2dMv/5v7STV2U76ZBT6LC7/oo7e/0bRhLfUmsdvqjCjmxrC6yO4ppbgmolraWccJQDYvRbJK2dQjqBkbS12Ik6yO5YbINNzsUPHogx1deAohUrEEWqUB7iTqNSAoHQVK4U70WSudnKNZmrg110qpuZ6GeHdb/daXPyuwL6/gZHBuKv+fLLZ7C5bhq2K4I9sJflxB/EdEbSTUcpM15MY2Q2PKbbHjCo6y733YBs9B1rdBKpAu8oXdxBYVuPeowrP8PhrDaiv1DPvGbcW1+eEOP36FkS/hRSw8ucWAP7lNcSP7OPakXac8zH0MYoRgCEYJZKNu/m8PSPlsmvyFOu9JwU4H7Ujnbwy0EPZV+vJGKBJMJbWIJe42XnfP/cynIIS011Eya7KoaZedzO7Ten1Ub5xM+UbN0+ufZ4StPIw/qea0Zc+mBssgPiRdnoOtEGfRYnhDnT/7kb0B+opXfdsrj8nEWc4to/EX1qgz7p5zTp2PMbxLFnoeIr3LCyA9PlOjCXVLHyiCZ5ouq69nYhzpaONEjz3P04OMlWY2RjtPcinb2/n4tst7swvMNhLX95PcE0Es6IK51RHToGZKxaOEviWVJPu7aavo5W+Q62keywMAaUSApqrUPtElKGuKL2/34bx5VoWPNtCydoI2pJqrl5wJ8R4HiWfa/Z4snEz10TBtbeaEA80YC6rcT/PKx0S3Z30HmxFjsTxGa76p30dY+QVzpiV4XDf+9b09gSo+WFSZWEGLluoXovAOIb2P9zI8ECczFAccSrqxk+vXdqB9D01xE/HADdB8mlu3JQauc0HhbunbHt/IzawpIbUYByt32Ku4d4zEdehwTjO+diE7QvBVpC0YdiGzBhDSi/m+/W8fGAaMP9rYVIXLWtG/2tS9VpwxSKgQHqKKmTozAetYLvxyhyjOl2AuhAjZI4mTXqBpUPhtdXFaAKV/jSGoUAfZ++6EFdzku0LQROuIU1t9IsM+e8V4j1dmFFDa8JVoOHFpPGeUfcGCNw2+TWlJsAUE7jdMcgZXR/1yBPdm881e36ryJ9ss40Z/z/osYYbr81Eg3O7Y3cr902G6+cFn4HvWxYxEyga+gsCzXFkZrZJFDG9UI7MaKJy46HZJlLENKNy4yFND4DKJA/PNpcipgcqkzysB7wfq8n+hsm147NNq4ipxNzVgPcbJhqA9uRbLzi2PFm6Ams2iRUxdShdieXY8qT21J5N4Ck6i+LvjN0lKPA7Y/8HNZx9pFGdGEYAAAAASUVORK5CYII=);
            cursor: pointer;
            background-repeat: no-repeat; /* 防止圖片重複顯示 */
        }

// 檢查是否成功選擇了 #menu_li_1 元素
var menuLi1Element = document.querySelector('#menu_select #menu_li_1');
if (menuLi1Element) {
    console.log('成功選擇了 #menu_li_1 元素');
} else {
    console.log('未成功選擇 #menu_li_1 元素');
}


    `);
})();
