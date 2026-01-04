// ==UserScript==
// @name         Shelby: Быстрые ответы
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  .
// @author       Pavel Kharkov
// @match        https://shelbygrooming.ru/*
// @match        http://*.100up.ru/*
// @grant        none
// @license      UNLICENSED
// @downloadURL https://update.greasyfork.org/scripts/435367/Shelby%3A%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/435367/Shelby%3A%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!((window.location.host === 'shelbygrooming.ru') || window.location.host.includes('shelby.100up.ru'))) return;

    const template = (expression, valueObj) => {
        const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
        const text = expression.replace(templateMatcher, (substring, value, index) => {
            value = valueObj[value];
            return value;
        });
        return text;
    };

    const app = window.app;
    const ajax = new app.Ajax(null, {
        method: 'post',
        url: '/answers.json',
        responseType: 'json',
        done(data) {
            if (!data) return;

            let answers = data.data.items;
            console.log(answers);

            const styleEl = document.createElement('style');
            document.head.appendChild(styleEl);
            const svgImage = window.btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e1c19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>');
            styleEl.sheet.insertRule(`
            .has-answer{
                position: relative;
            }`, 0);
            styleEl.sheet.insertRule(`
            .has-answer::before{
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: calc(100% + 4px);
                width: 24px;
                height: 24px;
                background-image: url('data:image/svg+xml;base64,${svgImage}');
                background-size: contain;
            }`, 0);
            styleEl.sheet.insertRule(`
            .has-answer:hover{
                background: #fff5e1;
                cursor: pointer;
            }`, 0);
            styleEl.sheet.insertRule(`
            h1.has-answer::before{
                width: 48px;
                height: 48px;
                right: calc(100% + 12px);
            }`);
            styleEl.sheet.insertRule(`
            td.has-answer::before{
                right: auto;
                left: 78px;
            }`);

            const setupAnswer = (service, foundAnswer, templateVars) => {
                const answer = foundAnswer.answers[0];
                service.classList.add('has-answer');
                service.setAttribute('title', 'Нажмите, чтобы скопировать ответ');
                service.addEventListener('click', () => {
                    const textareaContent = template(answer, templateVars);
                    const popupContent = `
                    <div class="popup popup-answer" style="max-width: 750px;">
                        <div class="popup__inner">
                            <textarea class="w-100" rows="16">${textareaContent}</textarea>
                            <div class="row">
                                <div class="col-sm-6 col-12 mt-2">
                                    <button type="button" class="btn btn-primary btn-lg w-100 -whatsapp">Скопировать для WhatsApp</button>
                                </div>
                                <div class="col-sm-6 col-12 mt-2">
                                    <button type="button" class="btn btn-primary btn-lg w-100 -instagram">Скопировать для Instagram</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    window.jQuery.magnificPopup.open({
                        items: {
                            src: popupContent
                        }
                    });

                    const textarea = document.querySelector('.popup-answer textarea');
                    textarea.select();
                    document.execCommand('copy');
                    textarea.selectionStart = 0;
                    textarea.selectionEnd = 0;

                    const copyButtonWhatsapp = document.querySelector('.popup-answer .btn-primary.-whatsapp');
                    copyButtonWhatsapp.addEventListener('click', () => {
                        textarea.select();
                        document.execCommand('copy');
                        window.jQuery.magnificPopup.close();
                    });

                    const copyButtonInstagram = document.querySelector('.popup-answer .btn-primary.-instagram');
                    copyButtonInstagram.addEventListener('click', () => {
                        textarea.value = textarea.value.replace(/\*/g, '');
                        textarea.select();
                        document.execCommand('copy');
                        window.jQuery.magnificPopup.close();
                    });
                });
            };

            //Страница породы
            if (document.querySelector('.price-detail')) {
                answers = answers['Порода'];
                if (!answers) return;

                const serviceCategory = document.querySelectorAll('.services-list > .services-list__category, .services-list > .services-list__item');
                let categoryTitle;
                const foundCategory = serviceCategory.forEach(category => {
                    const isItem = category.classList.contains('services-list__item');
                    const title = category.querySelector(isItem ? '.services-list__text' : '.services-list__title');
                    if (title) {
                        categoryTitle = title.childNodes[0].textContent.trim();
                    }
                    const categoryAnswers = answers.filter(answer => {
                        return (answer.category + (isItem ? '' : ':')) === categoryTitle;
                    });

                    if (categoryAnswers.length === 0) return false;

                    const subItems = category.querySelectorAll('.services-list__item.-sub');
                    const serviceItems = isItem ? [category] : [category.querySelector('.services-list__title'), ...subItems];
                    serviceItems.forEach(service => {
                        const isTitle = service.classList.contains('services-list__title');
                        const serviceName = isTitle ? service.textContent.trim() : service.querySelector('.services-list__text').childNodes[0].textContent.trim();

                        const foundAnswer = categoryAnswers.find(answer => {
                            return answer.service === serviceName;
                        });
                        if (!foundAnswer) return;

                        if (foundAnswer.answers.length === 1) {
                            setupAnswer(service, foundAnswer, {
                                breed: isTitle ? '' : document.querySelector('h1').textContent.trim(),
                                price: isTitle ? '' : service.querySelector('.services-list__price').textContent.trim()
                            });
                        }
                    });
                });
            }

            //Услуги для кошек
            else if (document.querySelector('.service-detail') && document.querySelector('h1').textContent.trim() === 'Услуги для кошек') {
                answers = answers['Услуги для кошек'];
                if (!answers) return;

                const serviceItems = document.querySelectorAll('.service-detail__table tbody tr');
                serviceItems.forEach(service => {
                    const serviceName = service.querySelector('.service-detail-table__name').textContent.trim();

                    const foundAnswer = answers.find(answer => {
                        return answer.service === serviceName;
                    });
                    if (!foundAnswer) return;

                    if (foundAnswer.answers.length === 1) {
                        const maineCoonCell = service.querySelector('td:nth-child(3)');
                        setupAnswer(maineCoonCell, foundAnswer, {
                            //allBreeds: '',
                            //breed: 'Мейнкун',
                            allBreeds: 'вашей ',
                            breed: '',
                            price: maineCoonCell.textContent.trim()
                        });

                        const allBreedsCell = service.querySelector('td:nth-child(4)');
                        setupAnswer(allBreedsCell, foundAnswer, {
                            allBreeds: 'вашей ',
                            breed: '',
                            price: allBreedsCell.textContent.trim()
                        });
                    }
                });
            }

            //Детский сад для собак
            else if (document.querySelector('.zoonursery')) {
                answers = answers['Детский сад для собак'];
                if (!answers) return;

                setupAnswer(document.querySelector('.zoonursery-content__title'), answers[0]);
            }

            //Кинолог
            else if (document.querySelector('.cynologist')) {
                answers = answers['Кинолог'];
                if (!answers) return;

                let price;
                let priceSalon;
                const priceItem = document.querySelector('.simple-section-content-one-price__item.flex-grow-1');
                if (!priceItem) return;
                const priceContent = priceItem.closest('.simple-section__content');
                if (!priceContent) return;

                priceContent.querySelectorAll('.simple-section-content__one-price').forEach(item => {
                    const isSalon = item.querySelector('.simple-section-content-one-price__text').textContent === 'Индивидуальное занятие (с выездом)';
                    const currentPrice = item.querySelector('.simple-section-content-one-price__item.-flex .simple-section-content-one-price__text.-strong').textContent.trim();
                    if (isSalon) {
                        priceSalon = currentPrice;
                    } else {
                        price = item.querySelector('.simple-section-content-one-price__item.-flex .simple-section-content-one-price__text.-strong').textContent.trim();
                    }
                });
                setupAnswer(document.querySelector('.simple-section-content__title'), answers[0], {
                    price,
                    priceSalon
                });
            }
        }
    });
    ajax.fetch();
})();