// ==UserScript==
// @name        Chatgpt v2.2
// @namespace   Violentmonkey Scripts
// @match       https://chat.openai.com/
// @grant       none
// @version     2.2
// @author      Vinicius Romano
// @require     https://code.jquery.com/jquery-3.6.4.min.js
// @require     https://cdn.jsdelivr.net/gh/chatgptjs/chatgpt.js@f855a11607839fbc55273db604d167b503434598/dist/chatgpt-1.9.1.min.js
// @description 06/08/2023, 19:24:00
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468506/Chatgpt%20v22.user.js
// @updateURL https://update.greasyfork.org/scripts/468506/Chatgpt%20v22.meta.js
// ==/UserScript==


let isWriting = false
const updateList = () => {
  $('#actual-word div').text('Palavra atual: ' + listKeyWords[listNum]);
  $('#next-word div').text('Próxima palavra: ' + listKeyWords[listNum + 1]);
  $('#history-word').html('<div>Histórico:</div>'+listKeyWords.slice(0, listNum).map(el=>`<div>${el}</div>`).join(''))
}

const updateStatus = (status) => {
  console.warn(status, ' - ', listNum)
  $('#actual-status').text('Status: ' + status)
}

$('body').append(
  `<div id="bash-container">
        <div id="actual-status">Status: Ok</div>
        <div id="actual-word" class="sub-section" style="margin-top:10px">
            <div>Palavra atual: - </div>
        </div>
        <div id="next-word" class="sub-section">
            <div>Próxima palavra: - </div>
        </div>
        <div id="history-word" class="sub-section last">
						<div>Histórico:</div>
            <div>Nenhuma palavra</div>

        </div>
    </div>
`);


$(`<style>

  #actual-status{
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    margin: auto;
    border-radius: 5px;
    color: white;
    padding: 5px 15px;
    background-color: #202123;
    margin-top: 10px;
    font-size: 14px;
}


#bash-container{
	background:	#F5F3F5;
	width:400px;
	border-radius: 6px;
	padding:5px 20px;
	position:absolute;
	right: 50px;
	top: 50px;
  border: 1px solid #202123;
  box-shadow: 2px 2px;
}

.sub-section{
	border-bottom:2px solid #202123;
	padding: 5px 5px;
	padding-bottom:10px;
	margin-bottom:10px;
	border-radius: 2px;
}


.sub-section:last-child{
		border-bottom:0px;
}


#history-word{
    max-height: 400px;
    overflow: scroll;
}

</style>`).appendTo($('head'));


setInterval(() => {
  if (document.querySelectorAll(".opacity-50")[0])
    document.querySelectorAll(".opacity-50")[0].click();
}, 8000);

const finishMessage =
  "Por favor, continue usando o texto exato de sua última mensagem, cuidando da sintaxe, mostrando apenas coisas que você ainda não digitou. Não quero que você comece o conteúdo desde o início. Conclua o conteúdo nesse momento, ends the sentence with a full stop.";

// *Configurações //
// ** //



const versionGPT = window.location.href.match("gpt-4") ? '4' : '3.5';

const waitTimeByVersion = versionGPT == '4' ? 160000 : 90000;

/*
setInterval(() => {
  if (Date.now() - initTimer >= waitTimeByVersion){
    // $('form button .flex.w-full.items-center.justify-center.gap-2').click()
    searchNewTerm(listKeyWords[listNum])
    initTimer = Date.now()
  }

}, 5000);
*/



setInterval(() => {


  const btn = Array.from(document.querySelectorAll("form button")).find(
    (el) => el.textContent === "Stop generating"
  );

  console.log(btn, 'BTN2')

  if(btn && !isWriting) {
    updateStatus('Bora novamente!')
    newCallback()
  }else if(btn){
    console.log('aguardando')
  }

}, 2000);


const selectGpt4 = async () => {

  const btn = Array.from(document.querySelectorAll("button")).find(
    (el) => el.textContent === "ModelDefault (GPT-3.5)"
  );

  await wait(Math.random() * 1000 + 500);
  if(btn) btn.click()
  await wait(Math.random() * 1000 + 500);


  const btn2 = Array.from(document.querySelectorAll("li")).find(
    (el) => el.textContent === "GPT-4"
  );

  if(btn2) btn2.click()

  await wait(Math.random() * 1000 + 500);


}

const listKeyWords = [
  "tapete artesanal",
  "rede de descanso",
  "esculturas",
  "porta-retratos",
  "livros",
  "plantas",
  "fotos",
  "skate",
  "poltrona decorativa",
  "como cuidar do cachorro em casa",
  "mesa posta organizada",
];

const makeSearchTerm = (keyword, skip) => {
  //return skip ? 'Se não terminou, Continue e termine o conteúdo.' :`Resuma em uma linha o que é ${keyword}`
  return skip
    ? finishMessage
    : `Quero que atue como um redator SEO. Faça um conteúdo para blog com informações detalhadas sobre a keyword "${keyword}". É obrigatório que o conteúdo tenha mais de 800 palavras. O conteúdo deve conter H1,H2 e H3. A introdução do texto deve ser após o H1 e deve ter 2 parágrafos. Cada H2 devem ter no mínimo 2 parágrafos. Faça também meta-title e meta-description.`;
};

// * //

const identifyChanges = (text) => {
  return text.match("Regenerate");
};

//const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const wait = (ms) => {
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

const sendSubmit = async () => {
  await wait(Math.random() * 1000 + 2000);

  const btn = Array.from(document.querySelectorAll("form button")).find(
    (el) => el.children[0].tagName == 'SPAN'
  );
  if($(btn).prop('disabled')){
    document.querySelectorAll("textarea")[0].value = null;
    await wait(Math.random() * 1000 + 2000);
    document.querySelectorAll("textarea")[0].value = finishMessage;
    await wait(Math.random() * 1000 + 2000);

  }

   btn.click();

};

let skip = false;

let listNum = 0;

let initTimer;

const getAllTextToSave = () => {
  debugger;
  let text = "";
  let finish = false;
  const nodes = document.querySelectorAll(".markdown");

  const btn = Array.from(document.querySelectorAll("form button")).find(
    (el) => el.textContent === "Continue generating"
  );

  nodes.forEach((el, idx) => {
    text += el.innerText;
    if (!btn) finish = true;
  });
  return { text: text, finish: finish };
};

// const searchNewTerm = async (keyword, _skip) => {
// 	const input = document.querySelectorAll('textarea')[0];
// 	const inputEvent = new Event('input', {bubbles: true});
// 	input.value = makeSearchTerm(keyword)
//   const btn = document.querySelectorAll('form button')[0];
//   btn.removeAttribute('disabled')
// 	btn.click();
//   updateList()
//   await sendSubmit()
//   updateStatus('Gerando Texto')
//   initTimer = Date.now()
// };


const searchNewTerm = async (keyword, _skip) => {
  updateStatus('Bora pesquisar!')
  chatgpt.sendInNewChat(makeSearchTerm(keyword))
  await wait(1000)
  isWriting = false;
  updateStatus('Gerando Texto')
  updateList()
  initTimer = Date.now()
};

const continueText = () =>{
  const btn = Array.from(document.querySelectorAll("form button")).find(
    (el) => el.textContent === "Continue generating"
  );

  if(btn) {
    btn.click()
    newCallback()
  }
}

const promptDone = function (timeout = 100000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {


    var interval = setInterval(()=>{
      const btn = Array.from(document.querySelectorAll("form button")).find(
        (el) => el.textContent === "Continue generating" ||  el.textContent === "Regenerate response" || el.textContent === "Regenerate"
      );

      console.info(btn, 'BTN')
      const end = Date.now();
      console.log(`Execution time: ${end - start} ms`);

      if(btn) {
        clearMyInterval()
        resolve()
      }

    },2000)

    setTimeout(()=>{
       updateStatus('Erro! O botão de continuar não apareceu :(')
       clearMyInterval()
       resolve()
    }, timeout);

    const clearMyInterval = () => {
      clearInterval(interval)
    }

  });
};

// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
// const callback = async (mutationList, observer) => {
//   for (const mutation of mutationList) {
//     if (mutation.type === "childList") {
//       // Loop through the added nodes
//       for (const node of mutation.addedNodes) {
//         // Check if the added node is a code element
//         console.log(node.nodeName, node.type);
//         if (
//           node.nodeName === "BUTTON" &&
//           node.innerText != "Regenerate response"
//         ) {
//           // Get the text content of the code element
//           await wait(1500);
//           updateStatus('Aguardando texto ser finalizado...')
//           await promptDone(waitTimeByVersion);
//           debugger;
//           await wait(1000);
//           const textToSave = getAllTextToSave();
//           await wait(2000);
//           if (textToSave.finish) {
//             updateStatus('Texto Finalizado! Salvando ...')
//             await saveFile(textToSave.text, listKeyWords[listNum]);
//             await wait(2000);
//             await clearChat();
//             updateStatus('Pesquisando ' + listKeyWords[listNum])
//             if (listKeyWords[listNum]) searchNewTerm(listKeyWords[listNum]);
//           } else {
//             updateStatus('Solicitando a continuação')
//             await wait(1500);
//             continueText()
//             updateStatus('Gerando Texto')
//             initTimer = Date.now();
//           }
//         }
//       }
//     }
//   }
// };

const newCallback = async () => {
          isWriting = true;
          await wait(1500);
          updateStatus('Aguardando texto ser finalizado...')
          await promptDone(waitTimeByVersion);
          updateStatus('Texto terminou. Vamos salvar!')
          debugger;
          await wait(1000);
          const textToSave = getAllTextToSave();
          await wait(2000);
          if (textToSave.finish) {
            updateStatus('Texto Finalizado! Salvando ...')
            await saveFile(textToSave.text, listKeyWords[listNum]);
            await wait(2000);
            updateStatus('Limpando Chat')
            await clearChat();
            updateStatus('Chat Limpo')
            updateStatus('Pesquisando ' + listKeyWords[listNum])
            if (listKeyWords[listNum]) searchNewTerm(listKeyWords[listNum]);
          } else {
            updateStatus('Solicitando a continuação')
            await wait(1500);
            continueText()
            updateStatus('Gerando Texto')
            initTimer = Date.now();
          }
};


const slugify = (text) =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

let lastSave = null;

const saveFile = async (text, title) => {
  if (!text || !title) return;
  if (!lastSave) {
    lastSave = Date.now();
  }else if((Date.now() - lastSave) <= 5000){
    updateStatus('ChatGpt está lento e apresentou erro. Tentando voltar com o script :)')
    await wait(5000)
    return;
  }
  const blob = new Blob([text]);
  const a = document.createElement("a");
  a.download = `${slugify(title)}-${Date.now()}.txt`;
  a.href = URL.createObjectURL(blob);
  a.addEventListener("click", (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
  listNum += 1;
};

const clearChat = async () => {
  const btn = Array.from(document.querySelectorAll("a")).find(
    (el) => el.textContent === "Clear conversations"
  );

  const btn2 = Array.from(document.querySelectorAll("a")).find(
    (el) => el.textContent === "New chat"
  );

  await wait(1200);
  if (btn) btn.click();
  await wait(2500);
  if (btn) btn.click();
  await wait(1200);
  if(btn2) btn2.click();
  await wait(1200);
};



setTimeout(()=>{
  var target = document.body

  // cria uma nova instância de observador
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      console.info('Mutation');
      console.info(mutation.type);
    });
  });

  // configuração do observador:
  var _config = { attributes: true, childList: true, characterData: true };

  // passar o nó alvo, bem como as opções de observação
  observer.observe(target, _config);


},2000)

// Add an event listener for the load event on the window object
window.addEventListener("load", async function () {
  await wait(2500);
  if (listKeyWords[listNum]) searchNewTerm(listKeyWords[listNum]);
});