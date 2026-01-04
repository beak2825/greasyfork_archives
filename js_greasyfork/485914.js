// ==UserScript==
// @name         Bot Nick (teste)2 goldbot
// @version      0.2
// @author       Abed
// @match        *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8
// ==/UserScript==

// Função para gerar caractere invisível
function generateInvisibleChar() {
    var invisibleChars = ["\u200B", "\u200C", "\u200D", "\u2060", "\u180E", "\uFEFF"];
    return invisibleChars[Math.floor(Math.random() * invisibleChars.length)];
}

// Função para adicionar caracteres invisíveis aleatórios entre cada caractere da string
function rnext(kelime) {
    const hd = kelime.split('');
    const hu = hd.length;
    const yh = [];
    for (let i = 0; i < hu; i++) {
        yh.push(hd[i]);
        if (i < hu - 1) {
            const re = Math.floor(Math.random() * 3);
            const eh = '‏'.repeat(re);
            yh.push(eh);
        }
    }
    return yh.join('');
}

// Função para mudar o avatar
function changeAvatar() {
    var randomNum = "";
    for (var i = 0; i < 4; i++) {
        randomNum += generateInvisibleChar();
    }

    if (document.querySelector('input[maxlength="18"]')) {
        let e = document.querySelector('input[maxlength="18"]');
        let val = e.value;
        e.value = rnext("Goldbot");
        let ev = new Event('input', { bubbles: true });
        ev.simulated = true;
        let t = e._valueTracker;
        t ? t.setValue(val) : 0;
        e.dispatchEvent(ev);
    }

    var button1 = document.evaluate('//*[@id="screens"]/div/div[2]/div[1]/div[1]/div[1]/div[1]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button1) button1.click();

    var button2 = document.evaluate('//*[@id="popUp"]/div[1]/div/div[2]/div/div/div[1]/ul/li[9]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button2) button2.click();

    var button3 = document.evaluate('//*[@id="popUp"]/div[1]/div/div[3]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button3) button3.click();

    console.log('Avatar changed successfully');
}

// Função para clicar no botão com atraso
function clickButtonWithDelay() {
    var button4 = document.evaluate('//*[@id="screens"]/div/div[2]/div[2]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (button4) button4.click();
    console.log('New button clicked successfully');
}

// Função principal que inicia o script com um atraso definido pelo usuário
function startScriptWithDelay(delay) {
    if (!delay || isNaN(delay)) {
        console.log("Tempo de espera inválido. Script cancelado.");
        return;
    }

    setTimeout(changeAvatar, delay);
    setTimeout(clickButtonWithDelay, delay + 1090); // Adicione o tempo de espera desejado

    console.log(`Script iniciado com um atraso de ${delay} milissegundos.`);
}

// Chamar a função principal com o tempo de espera desejado (em milissegundos)
startScriptWithDelay(990); // Defina o tempo de espera desejado aqui (em milissegundos)
