// ==UserScript==
// @name         Lolzteam Radio
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Слушай радио прямо на Lolzteam
// @author       https://zelenka.guru/shark
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/457977/Lolzteam%20Radio.user.js
// @updateURL https://update.greasyfork.org/scripts/457977/Lolzteam%20Radio.meta.js
// ==/UserScript==

(function(){
    let new_field = document.createElement('li');
    let button = document.createElement('button');
    let selectList = document.createElement('select');
    let audio = document.createElement('audio');
    let selected_radio = 'Европа Плюс';
    let div = document.createElement('div');
    var radios = ['Европа Плюс', 'Авторадио', 'Хит FM', 'Русское радио', 'Дорожное радио', 'DFM', 'Зайцев FM', 'Европа Плюс: Urban', 'DFM: Кальян РЭП', 'Шансон', 'Phonk 24/7', 'Рекорд: Phonk', 'Маятник Фуко', 'Lolz FM'];

    audio.id = 'radio-audio';
    selectList.id = 'select-radio';
    selectList.style.width = '160px';
    selectList.style.padding = '6px';
    selectList.style.background = '#2d2d2d';
    selectList.style.color = '#d6d6d6';
    selectList.style.border = 'none';
    selectList.style.fontWeight = 'bold';
    selectList.style.borderRadius = '6px';
    selectList.style.outline = '0';
    selectList.style.cursor = 'pointer';
    selectList.style.marginLeft = '20px';
    selectList.style.marginTop = '10px';
    selectList.style.position = 'inherit';
    selectList.style.userSelect = 'none';

    button.innerHTML = 'Play';
    button.className = 'radio-player';
    button.setAttribute('status', 'stop');
    button.style.width = '41px';
    button.style.padding = '6px';
    button.style.color = '#d6d6d6';
    button.style.background = '#2d2d2d';
    button.style.border = 'none';
    button.style.fontWeight = 'bold';
    button.style.borderRadius = '6px';
    button.style.cursor = 'pointer';
    button.style.position = 'inherit';
    button.style.marginLeft = '79.5px';
    button.style.marginTop = '80px';
    button.style.userSelect = 'none';

    let volume = document.createElement('input')
    volume.type = 'range';
    volume.style.position = 'inherit';
    volume.style.width = '100px';
    volume.style.marginLeft = '50px';
    volume.style.marginTop = '52px';
    volume.id = 'volume-radio';
    volume.min = 0;
    volume.max = 100;
    volume.step = 2;
    volume.value = 100;
    volume.style.background = '#2BAD72';
    volume.style.cursor = 'pointer';
    volume.style.WebkitAppearance = 'none !important';
    volume.style.background = 'red';
    volume.style.userSelect = 'none';

    div.appendChild(selectList);
    div.appendChild(button);
    div.appendChild(audio);
    div.className = 'radio-class'
    new_field.id = 'radio-block'
    new_field.appendChild(div);

    let new_div = document.createElement('div');
    new_div.id = 'radio-div';
    new_div.style.width = '200px';
    new_div.style.height = '120px';
    new_div.style.backgroundColor = '#272727';
    new_div.style.position = 'absolute';
    new_div.style.left = '-210px';
    new_div.style.top = '100px';
    new_div.style.borderRadius = '10px';
    new_div.style.userSelect = 'none';
    new_div.appendChild(button);
    new_div.appendChild(selectList);
    new_div.appendChild(volume);

    for (var i = 0; i < radios.length; i++) {
        var option = document.createElement('option');
        option.value = radios[i];
        option.text = radios[i];
        option.className = 'user-radio';
        selectList.appendChild(option);
    }

    let field = document.querySelector('.secondaryContent');
    field.append(new_field);
    field.append(new_div);

    document.querySelector('#volume-radio').oninput = function(){
        let audio_volume = this.value / 100;
        get_audio.volume = audio_volume;
        GM_setValue('volume', audio_volume);
    }

    let listOnchange = document.querySelector('#select-radio').onchange = function(event){
        selected_radio = event.target.value;
    }

    var get_audio = document.querySelector('#radio-audio');
    var radio_value = GM_getValue('radio');

    if (radio_value){
        let docx = document.querySelector('.radio-player')
        if (radio_value == 'Европа Плюс'){
            get_audio.src = 'https://europaplus.hostingradio.ru:8014/europaplus320.mp3?5b8b3595';
            get_audio.play();
        }

        else if (radio_value == 'Авторадио'){
            get_audio.src = 'https://ic7.101.ru:8000/v3_1?f474e85';
            get_audio.play();
        }

        else if (radio_value == 'Хит FM'){
            get_audio.src = 'https://hitfm.hostingradio.ru/hitfm128.mp3?6823dbe';
            get_audio.play();
        }

        else if (radio_value == 'Русское радио'){
            get_audio.src = 'https://rusradio.hostingradio.ru/rusradio96.aacp?e88b';
            get_audio.play();
        }

        else if (radio_value == 'Дорожное радио'){
            get_audio.src = 'https://dorognoe.hostingradio.ru:8000/dorognoe?747b3618';
            get_audio.play();
        }

        else if (radio_value == 'DFM'){
            get_audio.src = 'https://dfm.hostingradio.ru/dfm96.aacp?2f85ca10';
            get_audio.play();
        }

        else if (radio_value == 'Зайцев FM'){
            get_audio.src = 'https://zaycevfm.cdnvideo.ru/ZaycevFM_pop_256.mp3';
            get_audio.play();
        }

        else if (radio_value == 'Европа Плюс: Urban'){
            get_audio.src = 'https://epdop.hostingradio.ru:8033/ep-urban128.mp3?32b9fa40';
            get_audio.play();
        }

        else if (radio_value == 'DFM: Кальян РЭП'){
            get_audio.src = 'https://dfm-kalianrap.hostingradio.ru/kalianrap96.aacp?7ce29bcb';
            get_audio.play();
        }

        else if (radio_value == 'Шансон'){
            get_audio.src = 'https://chanson.hostingradio.ru:8041/chanson128.mp3?md5=iUBuUESjHbLOzY4mJw9ylw&e=1673435912';
            get_audio.play();
        }
        else if (radio_value == 'Phonk 24/7'){
            get_audio.src = 'https://azurecast.ru/listen/phonkradio247/thesoundofphonk.ogg';
            get_audio.play();
        }

        else if (radio_value == 'Рекорд: Phonk'){
            get_audio.src = 'https://radiorecord.hostingradio.ru/phonk96.aacp';
            get_audio.play();
        }

        else if (radio_value == 'Маятник Фуко'){
            get_audio.src = 'https://radiorecord.hostingradio.ru/mf96.aacp';
            get_audio.play();
        }

        else if (radio_value == 'Lolz FM'){
            get_audio.src = 'https://listen1.myradio24.com/lolz';
            get_audio.play();
        }

        let avolume = GM_getValue('volume');
        if (avolume){
            volume.value = avolume*100;
            get_audio.volume = avolume;
            GM_setValue('volume', avolume);
        }

        GM_setValue('radio', radio_value);

        docx.innerHTML = 'Stop';
        docx.setAttribute('status', 'play');
        selectList.disabled = true;
        selectList.style.cursor = 'default';
        let user_radio = document.querySelectorAll('.user-radio').forEach(function(element){
            if (element.value == radio_value){
                let select_radio = document.querySelector(`.user-radio[value="${radio_value}"]`)
                select_radio.setAttribute('selected', true)
            }
    })
    }

    let radio_play = document.querySelector('.radio-player').onclick = start_radio;

    function start_radio(){
        let docx = document.querySelector('.radio-player')
        let attr = docx.getAttribute('status');
        if (attr == 'stop'){
            var get_audio = document.querySelector('#radio-audio');

            if (selected_radio == 'Европа Плюс'){
                get_audio.src = 'https://europaplus.hostingradio.ru:8014/europaplus320.mp3?5b8b3595';
                get_audio.play();
            }

            else if (selected_radio == 'Авторадио'){
                get_audio.src = 'https://ic7.101.ru:8000/v3_1?f474e85';
                get_audio.play();
            }

            else if (selected_radio == 'Хит FM'){
                get_audio.src = 'https://hitfm.hostingradio.ru/hitfm128.mp3?6823dbe';
                get_audio.play();
            }

            else if (selected_radio == 'Русское радио'){
                get_audio.src = 'https://rusradio.hostingradio.ru/rusradio96.aacp?e88b';
                get_audio.play();
            }

            else if (selected_radio == 'Дорожное радио'){
                get_audio.src = 'https://dorognoe.hostingradio.ru:8000/dorognoe?747b3618';
                get_audio.play();
            }

            else if (selected_radio == 'DFM'){
                get_audio.src = 'https://dfm.hostingradio.ru/dfm96.aacp?2f85ca10';
                get_audio.play();
            }

            else if (selected_radio == 'Зайцев FM'){
                get_audio.src = 'https://zaycevfm.cdnvideo.ru/ZaycevFM_pop_256.mp3';
                get_audio.play();
            }

            else if (selected_radio == 'Европа Плюс: Urban'){
                get_audio.src = 'https://epdop.hostingradio.ru:8033/ep-urban128.mp3?32b9fa40';
                get_audio.play();
            }

            else if (selected_radio == 'DFM: Кальян РЭП'){
                get_audio.src = 'https://dfm-kalianrap.hostingradio.ru/kalianrap96.aacp?7ce29bcb';
                get_audio.play();
            }

            else if (selected_radio == 'Шансон'){
                get_audio.src = 'https://chanson.hostingradio.ru:8041/chanson128.mp3?md5=iUBuUESjHbLOzY4mJw9ylw&e=1673435912';
                get_audio.play();
            }

            else if (selected_radio == 'Phonk 24/7'){
                get_audio.src = 'https://azurecast.ru/listen/phonkradio247/thesoundofphonk.ogg';
                get_audio.play();
            }

            else if (selected_radio == 'Рекорд: Phonk'){
                get_audio.src = 'https://radiorecord.hostingradio.ru/phonk96.aacp';
                get_audio.play();
            }

            else if (selected_radio == 'Маятник Фуко'){
                get_audio.src = 'https://radiorecord.hostingradio.ru/mf96.aacp';
                get_audio.play();
            }

            else if (selected_radio == 'Lolz FM'){
                get_audio.src = 'https://listen1.myradio24.com/lolz';
                get_audio.play();
            }

            GM_setValue('radio', selected_radio);

            docx.innerHTML = 'Stop';
            docx.setAttribute('status', 'play');
            selectList.disabled = true;
            selectList.style.cursor = 'default';
        }

        else {
            let get_audio = document.querySelector('#radio-audio');
            get_audio.pause();
            get_audio.currentTime = 0;
            get_audio.removeAttribute('src');
            docx.innerHTML = 'Play';
            docx.setAttribute('status', 'stop');
            selectList.disabled = false;
            selectList.style.cursor = 'pointer';
            GM_setValue('radio', null);
        }
    }
})();