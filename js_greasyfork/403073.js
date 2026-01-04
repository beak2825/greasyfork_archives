// ==UserScript==
// @name         gaizima2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://eps.xjtu.edu.cn/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403073/gaizima2.user.js
// @updateURL https://update.greasyfork.org/scripts/403073/gaizima2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var jkm = $('#jkm');
    //var jkm =document.querySelector("#jkm > img");
  //  if (jkm==1){
   //     jkm.html('<img src="https://wx2.sinaimg.cn/mw690/007vT6tUly1geo8i4vqitj303c03cwe9.jpg" />');
   // }
    var srl = '';
    var imgbut = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAHxElEQVR4Xu2d247bMAxEs0DRj+4+96N7AVJ426S2HDJHIyq3nT5uZV044nBIyc7bj2+/jocJ/75+/4J6/fn++9wue2bdbt0xHWf9DB1TeWa0b2S0jkZvBnjeRqSbL9q8HTiGTQ3wRKZ5OIDphKLtQulJoVvyjOIJyprpOLRvajfi0e3cNh5MJ2SA/+uGzOjUngb4cDjYg4n/7u0UerBCQ3Qn0nZkSXSepC/VG8l62nmuvTt6nq4t6mtZjwGGyNMULmpngKGh22Z0l4vdd+foBjiJpwpFZvSoUGc0B0Uw0YLMS1M09SziGW0bA/wAMdgAb5VvJpgIu+A8mMa2SjWYURqZD6XRbFMp4ygpXKXd7q6iidFao2d0S3YyZQZFtNG5ZYY3wE2NmGwSe/CdCh0EHHvwXwvcLAYrFEdU69IvAZx6Y9bXqLHWNlDGUdZAnyHnAWklywBvLWCAG8+kpb1RwaQYfrSgkoUTymIRO0z1YMVrCUAVdVhFdT7jM5UY7Ci6svPqFOEZwVJsUImBAb4g+O69kcoBPh6PU25VZgqUxBkaW6nSjapkRNGrKRxZZzWgbX9vBphdv4k2SJb2GeBk+9qDa3w79GBSQG+nUEF3ZFk0FVHmQ8antehRr8+yDzLPD5EVUbQBjk1ogOn2amqv9DF7MLWUPZhbatXyqTx4/W4SyQGpRWj8U8ZU7jDRgwcyHxobZzINmeeu0EEfIiAb4PgqTrU4zTYSuhet5HMG+AEBzmT96f8U4IjHX2szSstR/0q+fW2ul/6/Yhxig9YZw9dHI681wAq8+SUHypAGuLE9MVyFZxHIK8aRAF4XOkhxQ1GQmQEICG29lypiYvjRiwntGJT5iKCtOEffVLIM8BYuGo4U7WKAG9cg9EQ8lnpcyxq074fz4KjQQRe0bkcT+1FFSz2L0v+t1hB5euV62r7u8gkHAzx+/5na0ADDUEAZTfFG5RkDPPmkiho4aqdkAiTk7CiaXNmpyOF6DaKkL8QAWcpFvTRrRzKR9nkqIMn6DHDHBX0FcAOcxDyST2bpC9nhn86DSZpERQBNA0j8oRSd9UXGybyU5rQkzlayQU8uj1S0Ad6alNqDMkqvPjHA/yxgD4Z3shS6jKpDy99HqU+hxHt7XbtmpepH1PbuPJhcmzXAPIJSFW2AuU3PLelGVIQVnc5TAkwNQigko2hqxIz+e+mbnrkqc6MKf1RkZell95sNmYIzwFvrGGDFLWChhKYS9uArIIzeTBjFeFQdvzzApJI1mvJkKcIowLSYQMVPtNYKAZfFSmIHZQ2okmWA49x9sQ1lEQNMtnHTxh6cb75hDyZpiXKerMRGWi2iHkcrbkpJtFK7ZOsxwAlrGGBoHHvw3lB38eBREUArTGRxQjhOxQ4dkyhVGj6qCx2EUXaHDdGPU1LxopTZqLF7QaZMkRX6DTC0eoWx4VDnZhVjvhzA5FYlzYOJcdq8cdSbFUWseHBl+KIbl27YrL/uL93R+JMZhBxK0BBhgPPtYoDv9NsQxIvtwR1lQhoKCCNQdiEgZm1KAJ71GSVl4tVphWJgshFomKIHFHTDZNrhtNZ2btO+smOA+QGFAYYvkhF6vebVn8aDo9SInu3SXUnHIVUySolU4UftZlI0oeEedkSHDUreaIA1ijbAiXK2B1/4abvoM0qKB16Lb5HSO/2dAkTPX2k7SsXRPEnsV86qK+wRfkbJAMdXcagOobGeCLvWeUg1cHnGADeWI17/EgBHdEsXN8oAilKteKbyUIEKJnpIo2QS6Et3lGpmGWfpl9CYAd4rdwP8Hv9uUiULUcFEnYR6vQE2wNtorMj9LH0a9ZIsLkV9z4yN0Vqz8EGfIbpod9hAPidMYzBRoO0kDXC8/Ul+nemTNE0iu2VpQ/Mx2h8tllxqR73EHizkhplnUsNTuqUCg2yWCi8h48xkrmx8JLJGqdcA7yGoDE0GOLHAy3swubKjiKxsVxGj0oqZkjfSnJSocLUIQ+c9qrDRlR0DvDXzI1TMiJN8qGh7cAzeS3jw6IfQMuVLUqNRRTya8vSo/1NbJXwoSrtCeaPPKFHFR2mDqHJlTBpbM2Mrc6PrHgWZ2mQ9jgEWcn578JWtqngJUZP24L2Vut9NUmhGUZ3tOCTWZlRJzpOXMck42dyijONWxZ52bgY4efmMxjwiFA3wlbcXiGfZgy9QdPQJB4WKZ9ITSbmqaZ2up7Id0Sc9qV34A9EGeGsBavjRdvR5uqkMcHJlhxqxst1UgKmomJWy0DSHKmIyT8pUim2oJlDmSW2AXj6jRiBCqE1Fot1P4ykdc92fUnkywB05JEkrDHD+FdthD6a7nA4UeZAScyq9nrITDR9KPFbmQJmr+7iQSnRqEANM4WVvd+wqWb3nwQZ4DwgJOZQRM7gVtrQHQweijPQpKZrWYekur1a0BBQKsOJlM9d9Ew82wPx7HZSiIfH038lSYrABNsAf+4ZK/1FKo+NQLyEpYNZXNB9aCcvW87AUTWOeQmkGuPgjnwpFG+DJlayZ9ETyxqxUqcyNqluFLqP50CJOtJkzx6As9JSHDQaY6xUDDO9kUWFHcuosE8lOvSgLrfu4yYF/Bd0qiyOeXqEPKF32zqdChxjg5kYHiYdtGwPcbN1KulPKlpQGaX5rgA0wYecpxZ4/cp4F54qHqbEAAAAASUVORK5CYII="
    addFloatBox(srl, imgbut)
    function addFloatBox(floatLink, ico) {
    //make float box
    var box = document.createElement('div');
    box.id = 'zimabButton ';

    GM_addStyle(
        ' #zimabButton {             ' +
        '    position:  absolute;    ' +
        '    top: 994px; left: 72.3px;   ' +
       // '    max-width: 500px;      ' +
        '    z-index: 999;      ' +
        ' } ');
    //box.innerHTML = "<a href=\"" + floatLink + "\"><img id=\"imgCheck\" src=\"" + ico + "\" style=\"height: 120px !important; width: 120px !important; margin: 2px !important; display: inline-block;\"></a>";
    box.innerHTML = "<img id=\"imgCheck\" src=\"" + ico + "\" style=\"height: 121px !important; width: 121px !important; margin: 2px !important; display: block;\"></a>";

    document.body.appendChild(box);
    }

    // Your code here...
})();