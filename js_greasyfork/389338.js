// ==UserScript==
// @name         PTS Zlecenia
// @description  Dodatkowe informacje dla zleceń PTS
// @version      0.1
// @author       Marek
// @match        https://orders.mta.truckers.com.pl/progress/*
// @namespace https://greasyfork.org/users/336611
// @downloadURL https://update.greasyfork.org/scripts/389338/PTS%20Zlecenia.user.js
// @updateURL https://update.greasyfork.org/scripts/389338/PTS%20Zlecenia.meta.js
// ==/UserScript==

(function() {

    document.body.style.backgroundColor = "#242828";
    document.body.style.color = "#ffffff";
    document.getElementsByTagName('p')[0].style.textShadow = null;

    var inputs = document.createElement('div');
    inputs.id = 'inputs';
    inputs.style = ("margin-left: 20px");
    inputs.innerHTML = "<label><input type='radio' name='capacity' value='10' checked/> Barrack</label> <label><input type='radio' name='capacity' value='20' style= 'margin-left: 25px;'/> Zestaw - Cysterna</label> <label><input type='radio' name='capacity' value='24' style= 'margin-left: 25px;' /> Zestaw</label> <label><input type='radio' name='capacity' value='other' style= 'margin-left: 25px;' /> Inny</label> <input type='number' id='other' placeholder='Ładowność (t)' style=' color: black; width: 120px;'> <input type='submit' value='Zapisz' id='save' style= 'margin-left: 25px; width: 65px; height: 26px; background: #242828;'>";
    document.getElementsByTagName('body')[0].appendChild(inputs);

    var cap = localStorage.getItem('capacity');
    var oth = localStorage.getItem('other');

    if (cap !== null) {
        document.querySelector('input[name="capacity"][value="' + cap + '"]').checked = true;
    }

    if (oth !== null) {
        document.getElementById('other').value = oth;
    }

    var data = document.getElementsByTagName('p')[0];
    const pieces = data.textContent.split(" ");

    var capacity = document.querySelector('input[name="capacity"]:checked').value;
    var other = document.querySelector('input[id="other"]');


    if (capacity == 'other') {
        var rest = Math.round((pieces[3] - pieces[1]) * 10) / 10;
        var course100 = Math.ceil((rest / other.value) * 1) / 1;
        var course110 = Math.ceil((rest / (other.value * 1.1)) * 1) / 1;
        var state = Math.round(((pieces[1] / pieces[3]) *100) * 10) / 10;
    } else{
        rest = Math.round((pieces[3] - pieces[1]) * 10) / 10;
        course100 = Math.ceil((rest / capacity) * 1) / 1;
        course110 = Math.ceil((rest / (capacity * 1.1)) * 1) / 1;
        state = Math.round(((pieces[1] / pieces[3]) *100) * 10) / 10;
    }


    var iDiv = document.createElement('div');
    iDiv.id = 'info';
    iDiv.style = ("margin-left: 20px");
    iDiv.innerHTML = "<br> STAN ZLECENIA: "+state+"%<br>Dostarczono: "+pieces[1]+"<br>Pozostało: "+rest+"<br>Kursów 100%: "+course100+"<br>Kursów 110%: "+course110+"<br>";
    document.getElementsByTagName('body')[0].appendChild(iDiv);

    document.querySelectorAll('input[name="capacity"]').forEach(function(element) {
        element.addEventListener('change', function () {
            var capacity = document.querySelector('input[name="capacity"]:checked').value;
            var other = document.querySelector('input[id="other"]').value;

            if (capacity == 'other') {
                var rest = Math.round((pieces[3] - pieces[1]) * 10) / 10;
                var course100 = Math.ceil((rest / other) * 1) / 1;
                var course110 = Math.ceil((rest / (other * 1.1)) * 1) / 1;
                var state = Math.round(((pieces[1] / pieces[3]) *100) * 10) / 10;

            } else {
                rest = Math.round((pieces[3] - pieces[1]) * 10) / 10;
                course100 = Math.ceil((rest / capacity) * 1) / 1;
                course110 = Math.ceil((rest / (capacity * 1.1)) * 1) / 1;
                state = Math.round(((pieces[1] / pieces[3]) *100) * 10) / 10;
            }

            var iDiv = document.getElementById('info');
            iDiv.innerHTML = "<br> STAN ZLECENIA: "+state+"%<br>Dostarczono: "+pieces[1]+"<br>Pozostało: "+rest+"<br>Kursów 100%: "+course100+"<br>Kursów 110%: "+course110+"<br>";

        });
    });

    other.addEventListener('change', function () {
        var rest = Math.round((pieces[3] - pieces[1]) * 10) / 10;
        var course100 = Math.ceil((rest / other.value) * 1) / 1;
        var course110 = Math.ceil((rest / (other.value * 1.1)) * 1) / 1;
        var state = Math.round(((pieces[1] / pieces[3]) *100) * 10) / 10;

        var iDiv = document.getElementById('info');
        iDiv.innerHTML = "<br> STAN ZLECENIA: "+state+"%<br>Dostarczono: "+pieces[1]+"<br>Pozostało: "+rest+"<br>Kursów 100%: "+course100+"<br>Kursów 110%: "+course110+"<br>";
    });

    document.getElementById('save').addEventListener('click', function () {
        localStorage.setItem('capacity', document.querySelector('input[name="capacity"]:checked').value);
        localStorage.setItem('other', other.value);

    });

})();