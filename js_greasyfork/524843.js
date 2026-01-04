// ==UserScript==
// @name         Catwar замена стрелки
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Замена стандартной стрелки БР на автомат с патронами.
// @author       scroptnik
// @match        https://catwar.net/cw3/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        none
// @license scroptnik
// @downloadURL https://update.greasyfork.org/scripts/524843/Catwar%20%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B5%D0%BB%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/524843/Catwar%20%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B5%D0%BB%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imgSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/AK-47.png/800px-AK-47.png'; // ссылка на винтовку
    const imgWidth = '130px'; // длина винтовки
    const scaleX = 0;
    const rot = 0; // разворот картинки
    const pixCt = 10; // длина патрона в пикселях (делитель пикселей энергии)
    const defArrow = 1; // показать стандартную стрелку

	var scaleY;

	function getRotationFromMatrix(matrix) {
		if (matrix === 'none') return 0;
		const values = matrix.split('(')[1].split(')')[0].split(',');
		const a = parseFloat(values[0]);
		const b = parseFloat(values[1]);
		const angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
		return angle < 0 ? angle + 360 : angle;
	}

    function updateTransform(imgElement, arrowElement) {
        const arrow_style = window.getComputedStyle(arrowElement);
        const arrow_transform = arrow_style.getPropertyValue("transform");
        const arrow_rotation = getRotationFromMatrix(arrow_transform);

        const scaleY = (arrow_rotation <= 270 && arrow_rotation >= 90) ? -1 : 1;

        let transform = '';
        if (scaleX) transform += 'scaleX(-1) ';
        transform += `scaleY(${scaleY}) `;
        transform += `rotate(${rot}deg)`;

		if (scaleY == 1) imgElement.style.marginTop = '-15px';
        if (scaleY == -1) imgElement.style.marginTop = '-35px';

        imgElement.style.transform = transform;
    }

    function replace() {
        const arrowElements = document.getElementsByClassName('arrow');

        for (let i = 0; i < arrowElements.length; i++) {
            const arrowElement = arrowElements[i];
            const tableElement = arrowElement.querySelector('table');
            if (tableElement) {
                tableElement.style.visibility = 'hidden';
            }

            if (arrowElement.classList.contains('arrow-paws') && !defArrow) {
                arrowElement.classList.remove('arrow-paws');
            }

            const existingImg = arrowElement.querySelector('.rifle');
            if (existingImg) {
                updateTransform(existingImg, arrowElement);
            } else {
                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgElement.alt = 'Rifle';
                imgElement.style.width = imgWidth;
                imgElement.style.height = 'auto';
                imgElement.style.marginLeft = '-30px';
                imgElement.style.position = 'absolute';
                imgElement.className = 'rifle';

                updateTransform(imgElement, arrowElement);

                arrowElement.appendChild(imgElement);

                const ammoContainer = document.createElement('div');
                ammoContainer.className = 'ammoContainer';
                arrowElement.appendChild(ammoContainer);
                createAmmo(ammoContainer);
            }
        }
    }


    setInterval(replace, 100);
    setInterval(replaceAmmo, 100);

    let previousRedWidth = 0;
    let previousGreenWidth = 0;
    function createAmmo(ammoContainer) {
        const redArrow = ammoContainer.parentElement.querySelector('.arrow_red');
        const greenArrow = ammoContainer.parentElement.querySelector('.arrow_green');

        const redWidth = parseInt(redArrow.style.width, 10);
        const greenWidth = parseInt(greenArrow.style.width, 10);

        ammoContainer.innerHTML = '';

        const totalBullets = (redWidth + greenWidth) / pixCt;
        for (let i = 0; i < totalBullets; i++) {
            const bullet = document.createElement('div');
            bullet.style.width = pixCt + 'px';
            bullet.style.height = '20px';
            bullet.style.display = 'inline-block';
            bullet.style.margin = '2px';

            if (i < greenWidth / pixCt) {
                bullet.style.backgroundColor = 'green';
            } else {
                bullet.style.backgroundColor = 'red';
            }

            ammoContainer.appendChild(bullet);
        }

        previousRedWidth = redWidth;
        previousGreenWidth = greenWidth;
    }


    function replaceAmmo() {
        const arrowElements = document.getElementsByClassName('arrow');

        for (let i = 0; i < arrowElements.length; i++) {
            const arrowElement = arrowElements[i];
            const ammoContainer = arrowElement.querySelector('.ammoContainer');

            if (ammoContainer) {
                const redArrow = arrowElement.querySelector('.arrow_red');
                const greenArrow = arrowElement.querySelector('.arrow_green');

                const redWidth = parseInt(redArrow.style.width, 10);
                const greenWidth = parseInt(greenArrow.style.width, 10);

                if (redWidth !== previousRedWidth || greenWidth !== previousGreenWidth) {
                    createAmmo(ammoContainer);
                }
            }
        }
    }
})();