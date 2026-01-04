// ==UserScript==
// @name         Chamada Meet Bonja
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Script para fazer chamada automaticamente na plataforma digital Meet do colégio Bonja.
// @author       Maicon Moreira
// @match        https://meet.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403663/Chamada%20Meet%20Bonja.user.js
// @updateURL https://update.greasyfork.org/scripts/403663/Chamada%20Meet%20Bonja.meta.js
// ==/UserScript==

const globalStyle = document.createElement('style')
globalStyle.innerHTML = `
#callButton {
    display: flex;
    align-items: center;
    align-content: center;
}

#callSpan {
    text-align: center;
    margin-left: 10px;
}

.float-right {
    position: absolute !important;
    /* left: 10px !important; */
    border-radius: 8px;
}`

document.body.appendChild(globalStyle)

function renderNotPresentStudents(students) {
    students.sort((a, b) => {
        if (a[1] > b[1]) {
            return 1;
        }

        if (a[1] < b[1]) {
            return -1;
        }

        return 0;
    });

    return students.reduce((acc, [name, group]) => `
        ${acc}
        <div class="student">
            <div class="name">${name.toUpperCase()}</div>
            <div class="group">${group ? `3${group}` : ''}</div>
        </div>
    `, '');
}

function renderPresentStudents(students, studentNames) {
    const studentsWithGroup = students.map(((student) => {
        const studentWithGroup = studentNames.find(([name]) => name === student);

        if (studentWithGroup) return studentWithGroup;
        return student;
    }));

    studentsWithGroup.sort((a, b) => {
        if (typeof a !== 'object') return 1;
        if (typeof b !== 'object') return -1;

        if (a[1] > b[1]) {
            return 1;
        }

        if (a[1] < b[1]) {
            return -1;
        }

        return 0;
    });

    return studentsWithGroup.reduce((acc, student) => {
        const name = typeof student === 'object' ? student[0] : student;
        const group = typeof student === 'object' ? student[1] : '';

        return `
        ${acc}
        <div class="student">
            <div class="name">${name.toUpperCase()}</div>
            <div class="group">${group ? `3${group}` : ''}</div>
        </div>
    `;
    }, '');
}



let studentsNames = [
    ['MARIANA CRISTINA HANSCH', 'A'],
    ['VITOR BRUM BORTOLI', 'A'],
    ['ARTHUR ESPÍNDOLA DA CRUZ', 'A'],
    ['MARIA EDUARDA DOBNER E SILVA', 'A'],
    ['LUIZA FERNANDES BREITENBACH', 'A'],
    ['MAITE KIRCHGASSNER ZOMER', 'A'],
    ['ARNON MUNHÓZ SCHÜTZ DOS SANTOS', 'A'],
    ['PIETRA VIANA ALVES MOREIRA', 'A'],
    ['DÉBORA NOGUEIRA VILODRES', 'A'],
    ['LAURA CAROLINA DA COSTA', 'A'],
    ['EUGENIO FRANCISCO VIEIRA NETO', 'A'],
    ['CAMILA VENTURI DE SANTANA', 'A'],
    ['KAROLAYN ALEXANDRE', 'A'],
    ['RAIKA TORRES DOS SANTOS', 'A'],
    ['TAINARA ROCHA', 'A'],
    ['GUSTAVO SCHULZE GORGES', 'A'],
    ['MUNIKE VINTER', 'A'],
    ['ANNA JÚLIA SCHULZ CORIA', 'A'],
    ['MAYARA BAUMER', 'A'],
    ['KAILANE BETHÂNIA DA SILVA CARDOSO', 'A'],
    ['BRUNA VERDINELLI DE OLIVEIRA', 'A'],
    ['LAVÍNIA LUCIOLI DA SILVA', 'A'],
    ['JULIA BUENO SIQUEIRA', 'A'],
    ['RODOLPHO CEZAR DE OLIVEIRA FILHO', 'A'],
    ['MARINA RODRIGUES', 'A'],
    ['LAURA THIEM KOTLEVSKI', 'A'],
    ['LETÍCIA MELLO TRAPP', 'A'],
    ['VICTOR DANTAS ANDRADE', 'A'],
    ['HENRIQUE NOGUEIRA OLIVIO', 'A'],
    ['HELOISA MENON RITZMANN', 'A'],
    ['CAROLINA GONÇALVES DEGANG', 'A'],
    ['JAIANE THAIS DOS SANTOS', 'A'],
    ['LILY KLUG BERALDI', 'A'],
    ['LUCAS GABRIEL TAVARES', 'A'],
    ['NICOLAS GHELLER TELLES', 'A'],
    ['HELENA DE SOUZA SANTANA', 'A'],
    ['GIOVANNA VASQUES MARTINHO', 'A'],
    ['HENRIQUE FRANCISCO ROSA', 'A'],
    ['PAULO PAGLIARINI GRAMS', 'A'],
    ['MELANIE DIETRICH', 'A'],
    ['LUCAS VINICIUS', 'A'],
    ['NATALIE GRAESER MARCONDES', 'A'],
    ['CAROLINE EVELIN GONÇALVES SILVÉRIO', 'A'],
    ['ESTHEFANI CAMILLI BLOEMER', 'A'],
    ['GIULIA CAMPOS', 'A'],
    ['REBECA FERREIRA CAESAR', 'A'],
    ['ISABELLA DALLA COSTA BALABAN FLORIO', 'A'],
    ['GIOVANNA GERALDI JORGI', 'A'],
    ['VOCÊ', 'A'],
    ['VICTORIA ALYSSA SOARES', 'A'],
    ['LETICIA BUSARELLO AGAPITO', 'A'],
    ['NÍCOLAS SIKORSKI MENGARDA', 'A'],
    ['AMANDA KESSELY', 'A'],
    ['AMANDA CORRÊA', 'A'],
    ['BRUNA LUIZE SOUZA DE OLIVEIRA', 'A'],
    ['VICTORIA AVANCI SOARES', 'A'],
    ['THIAGO CASTRO FRITSCHE', 'A'],
    ['JOSÉ GUILHERME DO AMARAL ADAMI', 'A'],
    ['GIOVANNA MORESCHI MACIEL', 'A'],
    ['FABÍOLA BORGES BARTEZAN', 'A'],
    ['ANA LAURA VIEIRA DE OLIVEIRA', 'A'],
    ['YASMIN CAMILLE BAUER', 'A'],
    ['BÁRBARA WERNER MAINHARDT', 'A'],
    ['MILLENA TRAVESSINI LEME', 'A'],
    ['PEDRO NACHTIGALL BISSO', 'A'],
    ['ANDRE LUIS LUCAS', 'A'],
    ['GABRIELA HOLANDA DE AQUINO', 'A'],
    ['SOFIA SILVA RODRIGUES', 'A'],
    ['CATHERINE PACHER', 'A'],
    ['MARIA LUIZA MENDES RIBEIRO', 'A'],
    ['MARIA JULIA LEME FERREIRA', 'A'],
    ['FERNANDO DZAZIO REIS', 'A'],
    ['LETICIA DE SOUZA', 'A'],
    ['SABRINA STUMM', 'A'],
    ['PEDRO HOLANDA DE AQUINO', 'A'],
    ['JULIA RANK TEIXEIRA', 'A'],
    ['MARIANE MAXIMO BASSINELLI', 'A'],
    ['SAADY DE ALMEIDA LEONES', 'A'],
    ['BERNARDO DE ANDRADE DIAS DA COSTA', 'A'],
    ['GABRIEL MADEIRA', 'A'],
    ['BRIAN FINDER BATISTA', 'A'],
    ['VITOR FERNANDES DE MELLO', 'A'],
    ['TIAGO EGERLAND RODRIGUES', 'A'],
    ['BEATRIZ DE ALMEIDA RIUL', 'A'],
    ['PEDRO HENRIQUE DE SENA TROMBINI TAGLIALE', 'A'],
    ['EDUARDA APARECIDA KÖHLER', 'A'],
    ['ISABEL DE MELLO DE CARVALHO', 'A'],
    ['TAINARA NEZZI CROPOLATO', 'A'],
    ['PEDRO TOMASI PEDROSO', 'A'],
    ['VICTORIA ELISA TEUBER DE OLIVEIRA', 'A'],
    ['HENRIQUE FERNANDES DE MELLO', 'A'],
    ['LUCAS NORBERTO RUFO VETORAZZI', 'A'],
    ['THIAGO FALASCA DUARTE', 'A'],
    ['VICTOR ROSSI JARACESKI', 'A'],
    ['LUCAS MOISEIS AZEVEDO', 'A'],
    ['ARTHUR NASCIMENTO', 'A'],
    ['LUCAS EDUARDO CHIN CHAN VAZ', 'A'],
    ['JADY KAROLINE PERES VENTURI', 'A'],
    ['CAROLINA RATHUNDE SANDLER', 'A'],
    ['HENRIQUE AGUIRRE SIGWALT', 'A'],
    ['THIAGO VINICIUS DEBONI DAUDT', 'A']
];

studentsNames = studentsNames.map(([name, group]) => [name.toLowerCase(), group]);

const totalStudents = studentsNames.length;

const calledNames = [];

let mainPage = false;
let buttonInjected = false;
let buttonText = 'Clique para iniciar chamada';
let inCalling = false;

const button = document.createElement('div');
const span = document.createElement('span');
button.style.cursor = 'pointer';

setInterval(() => {
    if (!mainPage) {
        if (document.getElementById('lcsclient')) mainPage = true;
    }

    if (mainPage) {
        const isChatOpen = !!document.querySelector('.z38b6.CnDs7d.hPqowe');

        if (isChatOpen) {
            const fullTopBar = document.querySelector('.Jrb8ue');
            const fullTopBarPositions = fullTopBar.getBoundingClientRect();

            // property 'getBoundingClientRect' of null error fix
            const chat = document.querySelector('.mKBhCf.qwU8Me.RlceJe.kjZr4');
            if (chat) {
                const chatPositions = chat ? chat.getBoundingClientRect() : null;

                const fullTopBarCorrectX = chatPositions.x - fullTopBarPositions.width;

                fullTopBar.children[0].classList.remove('eLNT1d');
                fullTopBar.classList.add('float-right');

                fullTopBar.style.left = `${fullTopBarCorrectX}px`;
            }
        } else {
            const fullTopBar = document.getElementsByClassName('Jrb8ue')[0];

            fullTopBar.classList.remove('float-right');
        }

        if (!buttonInjected) {
            const topBar = document.getElementsByClassName('NzPR9b')[0];

            topBar.style.borderRadius = '8px';

            span.innerText = buttonText;
            button.id = 'callButton';
            span.id = 'callSpan';

            button.onclick = () => {
                inCalling = !inCalling;

                if (!inCalling) {
                    const presents = calledNames;
                    const notPresents = studentsNames.filter(([name]) => !presents.includes(name));

                    presents.sort();
                    notPresents.sort();

                    const html = document.createElement('html');
                    const head = document.createElement('head');

                    const title = document.createElement('title');
                    title.innerText = 'Chamada';

                    const body = document.createElement('body');

                    const content = `
                                    <div class="presents">
                                        <h2>Presentes:</h2>
                                        ${renderPresentStudents(presents, studentsNames)}
                                    </div>
                                    <div class="not-presents">
                                        <h2>Ausentes:</h2>
                                        ${renderNotPresentStudents(notPresents)}
                                    </div>
                                `;

                    const styles = document.createElement('style');

                    styles.innerHTML = `
                                    * {
                                        font-family: sans-serif;
                                    }
                            
                                    body {
                                        display: flex;
                                        justify-content: space-around;
                                    }
                            
                                    .student {
                                        margin: 12px 0;
                                    }
                            
                                    .name, .group {
                                        display: inline-block;
                                    }                        
                                `;

                    body.innerHTML = content;
                    head.appendChild(title);
                    head.appendChild(styles);
                    html.appendChild(head);
                    html.appendChild(body);

                    const tmp = document.createElement('div');
                    tmp.appendChild(html);

                    const newTab = window.open();
                    newTab.document.write(tmp.innerHTML);
                }
            };

            button.append(span);
            topBar.prepend(button);

            buttonInjected = true;
        }
        if (buttonInjected) {
            if (inCalling) {
                if (!isChatOpen) {
                    buttonText = "<span style='color:red'>Por favor, abra o chat!</span>";
                }
                if (isChatOpen) {
                    buttonText = `Realizando chamada (${calledNames.length} de ${totalStudents}). Clique para finalizar.`;

                    const messages = document.querySelectorAll('.GDhqjd');
                    messages.forEach((message) => {
                        const name = message.children[0].children[0].innerText.toLowerCase();
                        const text = message.children[1].innerText.toLowerCase();

                        if (text.match(/a|b|c/gm) && text.length <= 2) {
                            if (!calledNames.includes(name) && name !== 'você' && name !== 'you') {
                                calledNames.push(name);
                            }
                        }
                    });
                }
            } else {
                buttonText = 'Clique para iniciar chamada';
            }

            span.innerHTML = buttonText;
        }
    }
});
