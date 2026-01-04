// ==UserScript==
// @name         이미지태그긁긁버튼
// @namespace    image-tag-geulgeul-button
// @version      0.3
// @description  ai님 충성충성
// @author       You
// @license MIT
// @match        http://dev.kanotype.net:8003/deepdanbooru/view/general/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452663/%EC%9D%B4%EB%AF%B8%EC%A7%80%ED%83%9C%EA%B7%B8%EA%B8%81%EA%B8%81%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/452663/%EC%9D%B4%EB%AF%B8%EC%A7%80%ED%83%9C%EA%B7%B8%EA%B8%81%EA%B8%81%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("thead").appendChild(document.createElement("tr"));

    document.querySelector("thead>tr:nth-child(2)").innerHTML = "<span>신뢰도 </span><input type='text' size='1' value='0.500' maxlength='5' id='reliability_text'></input><span> 이상만 </span>";

    var copy_button = document.createElement("BUTTON");
    copy_button.appendChild(document.createTextNode("태그 복사"));
    document.querySelector("thead>tr:nth-child(2)").appendChild(copy_button);


    copy_button.onclick = () => {
        copy_function2();
    };

    function copy_function2() {
        if (isNaN(document.getElementById('reliability_text').value)) { alert("신뢰도는 '?.???'의 형태로 입력해야 함"); return false; }

        var reliability_value = document.getElementById('reliability_text').value * 1000;
        var result_value = "";
        var count = 0;

        for (var i = 1; i <= document.querySelector('tbody:nth-child(2)').rows.length; i++)
        {
            var a = document.querySelector('tbody:nth-child(2)>tr:nth-child('+i+')>td:nth-child(2)').innerText;
            var b = a * 1000;
            if (reliability_value <= b)
            {
                result_value += document.querySelector('tbody:nth-child(2)>tr:nth-child('+i+')>td:nth-child(1)').innerText + ", ";
                count++;
            }
        }

        if (result_value == "") { alert("조건에 맞는 태그가 없음\n아마 소숫점을 잘못 입력했거나 신뢰도 값이 ㅈㄴ 크거나 태그가 안불러와졌거나 그럴 거임"); return false; }
        result_value = result_value.slice(0, -2);

        var asd = document.createElement("textarea");
        document.body.appendChild(asd);
        asd.value = result_value;
        asd.select();
        document.execCommand('copy');
        document.body.removeChild(asd);
        alert("복사 완료 (총 " + document.querySelector('tbody:nth-child(2)').rows.length + "개 중에서 " + count +"개)\n\n복사값\n" + result_value);
        return true;
    }
}
)();