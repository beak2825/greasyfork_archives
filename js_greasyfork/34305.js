// ==UserScript==
// @name           WME URComments Portuguese pt-PT List
// @description    This script is for Portuguese pt-PT comments to be used with my other script UR comments
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.6.22
// @match          https://editor-beta.waze.com/*editor*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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

// @downloadURL https://update.greasyfork.org/scripts/34305/WME%20URComments%20Portuguese%20pt-PT%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/34305/WME%20URComments%20Portuguese%20pt-PT%20List.meta.js
// ==/UserScript==

/* Changelog
 * 0.6.22 - Pequenas Correções.
 */

var URCommentPortugalPortugueseVersion = GM_info.script.version;
var URCommentPortugalPortugueseUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var URCommentPortugalPortugueseVersionUpdateNotes = "O URC PortugalPortuguese comment script precisa de novos @match URLs. Não se esqueçam do copiar de novo os vossos comentários para o script! v" + URCommentPortugalPortugueseVersion;

if (URCommentPortugalPortugueseUpdateMessage === "yes") {
	if (localStorage.getItem('URCommentPortugalPortugueseVersion') !== URCommentPortugalPortugueseVersion) {
		alert(URCommentPortugalPortugueseVersionUpdateNotes);
		localStorage.setItem('URCommentPortugalPortugueseVersion', URCommentPortugalPortugueseVersion);
	}
}

window.UrcommentsPortugalPortugueseReminderPosistion = 3;

//this is the note that is added to the the reminder link  option
window.UrcommentsPortugalPortugueseReplyInstructions = 'Para responder, por favor use o aplicativo do Waze ou vá para '; //'To reply, please either use the Waze app or go to ' - followed by the URL - superdave, rickzabel, t0cableguy 3/6/2015

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). in my list this is "7th day With No Response"
window.UrcommentsPortugalPortugueseCloseNotIdentifiedPosistion = 6;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area!
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsPortugalPortuguesedef_names = [];
window.UrcommentsPortugalPortuguesedef_names[6] = "Curva incorreta"; //"Incorrect turn";
window.UrcommentsPortugalPortuguesedef_names[7] = "Endereço incorreto"; //"Incorrect address";
window.UrcommentsPortugalPortuguesedef_names[8] = "Instruções incorretas de rotas"; //"Incorrect route";
window.UrcommentsPortugalPortuguesedef_names[9] = "Rotunda inexistente"; //"Missing roundabout";
window.UrcommentsPortugalPortuguesedef_names[10] = "Erro geral no mapa"; //"General error";
window.UrcommentsPortugalPortuguesedef_names[11] = "Curva proibida"; //"Turn not allowed";
window.UrcommentsPortugalPortuguesedef_names[12] = "Cruzamento incorreto"; //"Incorrect junction";
window.UrcommentsPortugalPortuguesedef_names[13] = "Ponte ou viaduto inexistente"; //"Missing bridge overpass";
window.UrcommentsPortugalPortuguesedef_names[14] = "Sentido de condução incorreto"; //"Wrong driving direction";
window.UrcommentsPortugalPortuguesedef_names[15] = "Saída inexistente"; //"Missing Exit";
window.UrcommentsPortugalPortuguesedef_names[16] = "Estrada inexistente"; //"Missing Road";
window.UrcommentsPortugalPortuguesedef_names[18] = "Ponto de interesse inexistente"; //"Missing Landmark";
window.UrcommentsPortugalPortuguesedef_names[19] = "Estrada bloqueada"; //"Blocked Road";
window.UrcommentsPortugalPortuguesedef_names[21] = "Nome de rua em falta"; //"Missing Street Name";
window.UrcommentsPortugalPortuguesedef_names[22] = "Sufixo ou prefixo de rua incorreto"; //"Incorrect Street Prefix or Suffix";


//below is all of the text that is displayed to the user while using the script this section is new and going to be used in the next version of the script.
window.UrcommentsPortugalPortugueseURC_Text = [];
window.UrcommentsPortugalPortugueseURC_Text_tooltip = [];
window.UrcommentsPortugalPortugueseURC_USER_PROMPT = [];
window.UrcommentsPortugalPortugueseURC_URL = [];

//zoom out links
window.UrcommentsPortugalPortugueseURC_Text[0] = "Zoom Out 0 & Fecha UR"; //"Zoom Out 0 & Close UR"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[0] = "Menor zoom possível e fecha a janela da UR"; //"Zooms all the way out and closes the UR window"

window.UrcommentsPortugalPortugueseURC_Text[1] = "Zoom Out 2 & Fecha UR";	//"Zoom Out 2 & Close UR"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[1] = "Zoom out nível 2, no qual as marcações do toolbox funcionam e fecha a janela da UR"; //"Zooms out to level 2 this is where I found most of the toolbox highlighting works and closes the UR window"

window.UrcommentsPortugalPortugueseURC_Text[2] = "Zoom Out 3 & Fecha UR"; //"Zoom Out 3 & Close UR"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[2] = "Zoom out nível 3, no qual a maioria das marcações do toolbox funciona e fecha a janela da UR"; //"Zooms out to level 3 this is where I found most of the toolbox highlighting works and closes the UR window"

window.UrcommentsPortugalPortugueseURC_Text_tooltip[3] = "Recarrega o mapa"; //"Reload the map"

window.UrcommentsPortugalPortugueseURC_Text_tooltip[4] = "Número de URs mostradas na area visivel"; //"Number of UR Shown"

//tab names - Nomes das abas
window.UrcommentsPortugalPortugueseURC_Text[5] = "Comentários"; //"Comments"
window.UrcommentsPortugalPortugueseURC_Text[6] = "Filtragem de URs"; //"UR Filtering"
window.UrcommentsPortugalPortugueseURC_Text[7] = "Ajustes"; //"Settings"

//UR Filtering Tab - Aba "Filtragem de URs"
window.UrcommentsPortugalPortugueseURC_Text[8] = "Clique aqui para Instruções"; //"Click here for Instructions"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[8] = "Instruções para filtragem de UR (em inglês)"; //"Instructions for UR filtering"
window.UrcommentsPortugalPortugueseURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU";

window.UrcommentsPortugalPortugueseURC_Text[9] = "Ativar filtragem de URs pelo URComments"; //"Enable URComments UR filtering"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[9] = "Ativa / desliga a filtragem pelo URComments"; //"Enable or disable URComments filtering"

window.UrcommentsPortugalPortugueseURC_Text[10] = "Ativar os balões com as contagens de URs"; //"Enable UR pill counts"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[10] = "Ativa / desliga os balões com contagem de URs"; //"Enable or disable the pill with UR counts"

window.UrcommentsPortugalPortugueseURC_Text[12] = "Esconder UR em espera"; //"Hide Waiting"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[12] = "Somente são mostradas as URs que precisam de trabalho (e.g. comentário inicial, fechamento), escondendo as demais"; //"Only show UR that need work (hide inbetween states)"

window.UrcommentsPortugalPortugueseURC_Text[13] = "Mostrar somente minhas URs"; //"Only show my UR"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[13] = "Esconde URs que não tenham comentários do editor que está em sessão"; //"Hide UR where there are zero comments from the logged in editor"

window.UrcommentsPortugalPortugueseURC_Text[14] = "Mostrar URs expirados"; //"Show others UR past reminder + close"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[14] = "Mostra URs que ultrapassaram ambos os prazos de lembrete e fechamento"; //"Show UR that have gone past the reminder and close day settings added together"

window.UrcommentsPortugalPortugueseURC_Text[15] = "Esconder URs com relembrar necessário"; //"Hide UR Reminders needed"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[15] = "Esconde URs que necessitam de relembrar o wazer para responder"; //"Hide UR where reminders are needed"

window.UrcommentsPortugalPortugueseURC_Text[16] = "Esconder URs com resposta de wazer"; //"Hide user replies"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[16] = "Esconde as URs que contém uma resposta do wazer"; //"Hide UR with user replies"

window.UrcommentsPortugalPortugueseURC_Text[17] = "Esconder URs a serem fechadas"; //"Hide UR close needed"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[17] = "Esconde URs expirados que precisam ser fechadas"; //"Hide UR that need closing"

window.UrcommentsPortugalPortugueseURC_Text[18] = "Esconder URs sem comentários"; //"Hide UR no comments"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[18] = "Esconde URs que não possuem comentários"; //"Hide UR that have zero comments"

window.UrcommentsPortugalPortugueseURC_Text[19] = "Esconder URs sem descrição ou comentários"; //"hide 0 comments without descriptions"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[19] = "Esconde URs que não contêm descrição ou comentários"; //"Hide UR that do not have descriptions or comments"

window.UrcommentsPortugalPortugueseURC_Text[20] = "Esconder URs com descrição e sem cometários"; //"hide 0 comments with descriptions"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[20] = "Esconde URs que tenham descrição mas não tenham comentários"; //"Hide UR that have descriptions and zero comments"

window.UrcommentsPortugalPortugueseURC_Text[21] = "Esconder URs fechados"; //"Hide Closed UR"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[21] = "Esconde UR fechados"; //"Hide closed UR"

window.UrcommentsPortugalPortugueseURC_Text[22] = "Esconder URs com tags"; //"Hide Tagged UR"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[22] = "Esconde URs que tenham tags com o estilo WSLM, ex. [NOTE]"; //"Hide UR that are tagged with URO stle tags ex. [NOTE]"

window.UrcommentsPortugalPortugueseURC_Text[23] = "Dias para relembrar: "; //"Reminder days: "

window.UrcommentsPortugalPortugueseURC_Text[24] = "Dias para fecho: "; //"Close days: "

//settings tab - Aba "Ajustes"
window.UrcommentsPortugalPortugueseURC_Text[25] = "Comentar automaticamente um UR novo"; //"Auto set new UR comment"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[25] = "Envia o comentário (UR comment) automaticamente nos novos URs, que ainda não tenham nenhum comentário"; //"Auto set the UR comment on new URs that do not already have comments"

window.UrcommentsPortugalPortugueseURC_Text[26] = "Enviar lembrete na UR"; //"Auto set reminder UR comment"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[26] = "Envia automaticamente um texto para relembrar ao wazer que deve responder nas URs que tenham comentário do editor e que tenham ultrapassado o prazo estipulado (dias para relembrar)"; //"Auto set the UR reminder comment for URs that are older than reminder days setting and have only one comment"

window.UrcommentsPortugalPortugueseURC_Text[27] = "Auto zoom em novos URs"; //"Auto zoom in on new UR"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[27] = "Zoom automático quando abrir URs que não possuam comentários e quando do envio de lembretes"; //"Auto zoom in when opening URs with no comments and when sending UR reminders"

window.UrcommentsPortugalPortugueseURC_Text[28] = "Auto centralizar UR";  //"Auto center on UR"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[28] = "Centralizar o mapa, no zoom atual, quando a UR possuir comentários e quando o zoom for menor que 3"; //"Auto Center the map at the current map zoom when UR has comments and the zoom is less than 3"

window.UrcommentsPortugalPortugueseURC_Text[29] = "Auto selecionar Aberto, Resolvido, Não Identificado"; //"Auto click open, solved, not identified"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[29] = "Omite a mensagem sobre questões pendentes ao wazer e, dependendo dos ajustes para aquele comentário, seleciona Aberto, Resolvido, Não Identificado"; //"Suppress the message about recent pending questions to the reporter and then depending on the choice set for that comment Clicks Open, Solved, Not Identified"

window.UrcommentsPortugalPortugueseURC_Text[30] = "Guardar automáticamente após um comentário resolvido ou não identificado"; //"Auto save after a solved or not identified comment"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[30] = "Se a opção \"Auto selecionar Aberto, Resolvido, Não Identificado\" estiver ativa, esta opção irá carregar no botão Guardar após escolher um comentário da lista e enviar para o wazer (botão enviar comentário)"; //"If Auto Click Open, Solved, Not Identified is also checked, this option will click the save button after clicking on a UR-Comment and then the send button"

window.UrcommentsPortugalPortugueseURC_Text[31] = "Fechar automático da janela de comentário"; //" Auto close comment window"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[31] = "O UR que não precisar de ser guardado será fechado automaticamente após selecionar um comentário da lista e clicar em enviar"; //"For the user requests that do not require saving this will close the user request after clicking on a UR-Comment and then the send button"

window.UrcommentsPortugalPortugueseURC_Text[32] = "Recarregar o mapa depois do comentário"; //"Auto reload map after comment"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[32] = "Recarrega o mapa depois de escolher um comentário da lista e enviar. Isso força o UOR+ a reaplicar os filtros escolhidos. No momente isso nao se aplica a nenhuma mensagem que foi salva, pois o salvamento automaticamente já recarrega o mapa"; //"Reloads the map after clicking on a UR-Comment and then send button. This forces URO+ to re-apply the chosen URO filters. Currently this does not apply to any messages that get saved. Since saving automatically reloads the map."

window.UrcommentsPortugalPortugueseURC_Text[33] = "Diminur zoom após comentário"; //"Auto zoom out after comment"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[33] = "Após clicar num comentário da lista e enviar o UR, o zoom do mapa volta no mesmo nível que estava anteriormente"; //"After clicking on a UR-Comment in the list and clicking send on the UR the map zoom will be set back to your previous zoom"

window.UrcommentsPortugalPortugueseURC_Text[34] = "Ativar automaticamente o separador URcomments"; //"Auto switch to the UrComments tab"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[34] = "Passa automaticamente para o separador URComments após a página carregar e ao abrir um UR. Quando a janela da UR for fechada volta a exibir o separador anterior"; //"Auto switch to the URComments tab after page load and when opening a UR, when the UR window is closed you will be switched to your previous tab"

window.UrcommentsPortugalPortugueseURC_Text[35] = "Mensagem de fecho - duplo clique (auto enviar)"; //"Close message - double click link (auto send)"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[35] = "Adiciona um link extra no comentário de fecho de UR que, com duplo clique coloca automaticamente o comentário na janela da UR e envia. Depois aciona outras opções que possam estar ligadas"; //"Add an extra link to the close comment when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled"

window.UrcommentsPortugalPortugueseURC_Text[36] = "Todos comentários - duplo clique (auto enviar)"; //"All comments - double click link (auto send)"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[36] = "Adiciona um link extra em cada comentário da lista que, aquando de duplo clique irá colar automaticamente o comentário na janela da UR e o enviará. Depois aciona outras opções que possam estar ligadas"; //"Add an extra link to each comment in the list that when double clicked will auto send the comment to the UR windows and click send, and then will launch all of the other options that are enabled"

window.UrcommentsPortugalPortugueseURC_Text[37] = "Lingua da lista de comentários"; //"Comment List"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[37] = "Mostra a lista de comentários selecionada. Há suporte para um lista personalizada ou, se preferir, pode sugerir modificações na lista dos comentários do script (em inglês - contate rickzabel @waze or @gmail) ou a lista em português-Portugal (contate Ricardo-Ruivo @waze)"; //"This is shows the selected comment list, there is support for a custom list or If you would like your comment list built into the this script or have suggestions on the Comments team’s list please contact me at rickzabel @waze or @gmail"

window.UrcommentsPortugalPortugueseURC_Text[38] = "desligar botões \"Concluído\" \/ \"Próximo\" "; //"Disable done / next buttons"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[38] = "desliga os botões Concluído / Próximo localizados na parte inferior da janela da UR"; //"Disable the done / next button at the bottom of the new UR window"

window.UrcommentsPortugalPortugueseURC_Text[39] = "Deixar de seguir UR após envio"; //"Unfollow UR after send"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[39] = "Deixa de seguir uma UR após o envio do comentário"; //"Unfollow UR after sending comment"

window.UrcommentsPortugalPortugueseURC_Text[40] = "Relembrar automaticamente"; //"Auto send reminders"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[40] = "Envia automaticamente avisos para os meus URs que estejam no ecra a relembrar sobre o pedido de informações"; //"Auto send reminders to my UR as they are on screen"

window.UrcommentsPortugalPortugueseURC_Text[41] = "Substituir com o nome do editor"; //"Replace tag name with editor names"
window.UrcommentsPortugalPortugueseURC_Text_tooltip[41] = "Quando uma UR contém o nome de um editor (normalmente, enviada pelo próprio editor) o nome nos balões é substituído pelo do editor"; //"When a UR has the logged in editors name in it replace the tag type with the editors name"

window.UrcommentsPortugalPortugueseURC_Text[42] = "(Duplo Clique)"; //double click to close links
window.UrcommentsPortugalPortugueseURC_Text_tooltip[42] = "Duplo Clique aqui para auto enviar -  "; //"Double click here to auto send - "

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[0] = "UR Comments - Você está com uma versão antiga do script dos comentários personalizados ou um erro de sintaxe que está a impedir o carregamento normal da lista de comentários. Em falta: "; //"UR Comments - You either have a older version of the custom comments file or a syntax error either will keep the custom list from loading. Missing: "

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[1] = "UR Comments - Os seguintes items estão a faltar na sua lista de comentários: "; //"UR Comments - you are missing the following items from your custom comment list: "

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[2] = " Lista não pode ser encontrada. Pode obtê-la, bem como as devidas instruções em  https://wiki.waze.com/wiki/User:Rickzabel/UrComments/"; //" List can not be found you can find the list and instructions at https://wiki.waze.com/wiki/User:Rickzabel/UrComments/"

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[3] = "URComments - Não pode definir os dias para fechamento para \"0\""; //"URComments you can not set close days to zero"

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[4] = "URComments - Para usar os links com duplo clique nos comentários deve ter Ativa a opção no separador de definições"; //"URComments to use the double click links you must have the autoset UR status option enabled"

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[5] = "desativar FilterURs2 porque a filtragem, contagem e auto envio de lembretes estão desligados"; //"aborting FilterURs2 because both filtering, counts, and auto reminders are disabled"

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[6] = "URComments: Tempo excedido no carregamento dos dados da UR, a tentar novamente."; //"URComments: Loading UR data has timed out, retrying." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[7] = "URComments: a relembrar o wazer no UR: "; // "URComments: Adding reminder message to UR: " - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[8] = "Filtragem de URs pelo URComments foi desligada pois os filtros de URO estão ativos"; //"URComment's UR Filtering has been disabled because URO\'s UR filters are active." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[9] = "UrComments detectou que possui alterações não guardadas!\n\nCom a opção de guardar automático ativada e com alterações não guardadas, não é possível enviar comentários que exigem que o script os guarde. Por favor guarde suas alterações e então selecione novamente o comentário que deseja enviar"; //"UrComments has detected that you have unsaved changes!\n\nWith the Auto Save option enabled and with unsaved changes you cannot send comments that would require the script to save. Please save your changes and then re-click the comment you wish to send."

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[10] = "URComments: não é possível encontrar a caixa de comentários! Para o correto funcionamento do script você precisa ter uma UR aberta"; //"URComments: Can not find the comment box! In order for this script to work you need to have a user request open." - this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPortugalPortugueseURC_USER_PROMPT[11] = "URComments: Irão ser enviadas lembranças de acordo com os dias colocados na respectiva area de definições. Somente ocorre quando estiverem na área visível. NOTA: quando usar essa função você não deve deixar nenhuma UR aberta a menos que vc tenha perguntas que necessitem de uma resposta do wazer, pois o script irá enviar a lembrança de pedido de resposta"; //"URComments This will send reminders at the reminder days setting. This only happens when they are in your visible area. NOTE: when using this feature you should not leave any UR open unless you had a question that needed an answer from the wazer as this script will send those reminders. " - conformation message/ question



//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Thanks for the reply"
// "<br>",
// "",
// "",

//PortugalPortuguese list
window.UrcommentsPortugalPortugueseArray2 = [
		"GERAIS",
                "",
                "",

                "Lembrança para os editores de UR que abriram",
                "Caro editor por favor complete o seu report!",
                "Open",

                "Limpar comentário e selecionar status da UR para Aberto",
                "",
                "Open",

		"Estrada em falta - Quarto de Lua",
		"Caro wazer, se o seu pedido de actualização do mapa de falta de estrada no cruzamento se refere a possível falta do \"quarto de lua\", a situação deve-se ao fato de assim o mapa estar mais optimizado para facilitar os cálculos das rotas a lhe serem apresentada pela aplicação!",
		"NotIdentified",

		"Resolvido",
                "Caro wazer, o problema foi encontrado e resolvido. Agradecemos a sua contribuição. Aguarde a actualização do mapa internacional (INTL), que pode ser acompanhada em: http://status.waze.com/",
                "Solved",

                "Duplicados",
                "Caro wazer por sua indicação e/ou analise detalhada detectou-se que existem vários reports na mesma zona e linha de trajecto. Como supomos que são tentativas repetidas de inicialização de pedidos de actualização do mapa iremos encerrar este report. Obrigado pela sua ajuda e boas viagens!",
                "NotIdentified",

                "1ª Advertência sem retorno (+7 dia sem resposta)",
                "Caro Wazer abriu um pedido de actualização \"$URD\" há mais de 7 dias. Por favor junte mais informação pois está difícil de identificar o problema. Sem sua participação teremos encerrar o report em breve.",
                "Open",

                "2ª Advertência - final - sem retorno (+15 dia sem resposta)",
                "Fechado porque faltou participação do autor do alerta na ajuda a identificação do erro.",
                "NotIdentified",

                "Resposta genérica de anomalia",
                "Caro wazer, examinei o seu pedido de correcção. Contudo não consegui verificar a origem do erro. Peço que me envie mais informações acerca do problema encontrado. Obrigado.",
                "Open",

		"ABERTOS",
                "",
                "",

		"Nome de rua errado",
		"Caro Wazer, qual o nome que está incorreto no mapa e qual o nome correto? Fico a aguardar a sua resposta dentro dos proximos dias.",
		"Open",

		"Erro na numeração da estrada",
		"Caro Wazer, que estrada está com a numeração incorreta? Qual era a numeração que deveria ser?",
		"Open",

                "Estrada bloqueada - Obras",
                "Caro Wazer, qual a rua que está bloqueada? Entre quais cruzamentos é o bloqueio? Sabe informacar por quanto tempo a estrada vai ficar fechada? Se conseguir identificar que o encerramento é por pouco tempo (máximo 1 dia) esse excerramento pode ser executado por si, por favor use a função Alertar > Bloqueio do próprio waze. Obrigado!",
                "Open",

                "Sinal de GPS incompleto",
                "A recepção do sinal de GPS no seu dispositivo não foi suficiente para ajudar na identificação do erro encontrado, pois as indicações de rotas guardadas pelo waze não passam pelo ponto do seu report. Terá assim de nos ajudar a melhor identificar o erro do seu pedido de actualização.",
                "Open",

                "Resposta de 48 Horas",
                "Fizemos algumas alterações no mapa. Por favor, espere mais umas 48 horas para as alterações aparecerem no mapa do aplicativo.",
                "Open",

		"Atualização manual",
                "Por favor tente estas opções. No aplicativo do Waze vá em Menu > Configurações > Config. Avançadas > Transferência de Dados > Atualizar mapa da minha área. Pode também tentar limpar o cache do aplicativo pelo painel configurações do seu smartphone. Por último, tente fazer um reset a aplicação escrevendo ##@resetapp no campo de busca e clicando em procurar.", 
                "Open",

                "A estrada foi fechada",
                "Obrigado pelo seu alerta de erro no mapa (UR), a estrada foi fechada pelo período por si indicado.",
                "Open",

                "Correção iniciada",
                "Começamos o processo para corrigir o problema. Obrigado pelo seu alerta de erro no mapa (UR). Aguarde a actualização do mapa internacional (INTL), que pode ser acompanhada em: http://status.waze.com/",
				"Open",

		"RESOLVIDO",
                "",
                "",

		"Erro já corrigido, mas mapa desatualizado",
                "Caro Wazer, o seu pedido de actualização já foi corrigida em resposta a outro pedido na mesma zona para o mesmo assunto. No entanto, o mapa ainda não foi carregado nos servidores com a correção. Estamos aguarde a actualização do mapa internacional (INTL), que pode ser acompanhada em: http://status.waze.com/ o que neste momento pode demorar perto de 2 semanas",
                "Solved",

                "Numeração de estradas corrigida",
                "Foi alterada/corrigida a numeração da estrada como informou. Aguarde a actualização do mapa internacional (INTL), que pode ser acompanhada em: http://status.waze.com/. Caso tenha salvo o local no histórico ou favoritos, exclua-os e faça uma nova pesquisa pelo endereço.",
		"Solved",

		"Corrigido o número da casa",
                "Introduzimos o número na casa que nos indicou. Isso deve corrigir o problema. Aguarde a actualização do mapa internacional (INTL), que pode ser acompanhada em: http://status.waze.com/", 
                "Solved",

                "NAO ENCONTRADOS",
		"",
		"",

                "Seguindo a sugestao do wase",
		"Caro wazer não foi possivel entrender o seu problema uma vez que seguiu o mesmo caminho que o waze sugeriu. Nesse sentido iremos cancelar o report por achar que não há nenhum problema na rota, mas caso o problema não fosse na rota e o condutor queira adicionar algum comentário pode na mesma responder a este report que reabriremos o mesmo para resolução da anomalia no mapa. Obrigado",
		"NotIdentified",

		"Radares",
                "Este é o canal para reportar erros de navegação e de mapa. No entanto se encontrou um Radar fixo deverá fornecer a posição mais exata do mesmo possível e a indicação de velocidade máxima no local. Obrigado!",
                "NotIdentified",

		"Restrições já incluídas",
		"As restrições que estão a ser indicadas no seu pedido de actualização já foram incluída no mapa. Aguarde a actualização do mapa internacional (INTL), que pode ser acompanhada em: http://status.waze.com/. Obrigado!",
		"NotIdentified",

		"Bloqueio temporário",
		"Caro Wazer, se a rua estiver completamente bloqueada use a função Alertar > Bloqueio. Desse modo, o wazer e outros que tenham essa rota irão obter novas rotas de modo a prevenir esse bloqueio.",
		"NotIdentified",

                "Resolução - estradas próximas",
		"O GPS não consegue distinguir entre as vias paralelas muito próximas. Apenas quando a distância aumenta é que ele pode perceber o erro.\n\n Se a estrada onde está não for a que o waze sugeriu como rota aguarde alguns segundos para que ele recalcule a melhor rota para o seu destino.",
		"NotIdentified",

		"Locais errados no Google Maps",
		"Caro Wazer, esse local já está correto no Waze. O problema está no Google Maps, o qual o Waze também usa para sugerir resultados. Prefira sempre os resultados do próprio Waze, ou mesmo do Foursquare, pois são os que menos apontam/levam para localização errada. Quando o resultado errado vem de alguma fonte externa (em geral, Google), a correcção deverá ser feita directamente no editor dessa fonte da informação.",
		"NotIdentified",

		"Retornos em U",
		"Atualmente, o Waze não lhe diz para fazer um retorno em U (\"U-turn\"). Ele irá calcular várias mudanças de direcção à esquerda/direita para criar o retorno em U. Esta é uma limitação da programação pode ser ajustada se houver a possibilidade fazer a inversão de marcha. Por favor ajude a nossa equipa para que essa alteração ao mapa possa ficar o melhor definida possível!",
		"NotIdentified",

		"<br>",
                "",
                "",

		//novos avisos
		"Bug do aplicativo",
		"Infelizmente, nessa situação, não há nada de errado com o mapa que possa estar provocando esses defeitos no aplicativo. Se o erro continuar, por favor reporte-o em https://support.google.com/waze/answer/6090951?hl=en",
		"NotIdentified",

		"DEFAULT",
		"",
		"",

		//Default URs  6 through 22 are all the different types of UR that a user can submit do not change them thanks
		//"Incorrect turn", //6
                "Mudança de direção incorreta",
		"Por favor nos informe o que houve de errado com a rota que o Waze lhe deu. Poderia nos dizer qual a rua mal sinalizada e o tipo de veiculo que tem definido no Waze? Obrigado",
                "Open",

                //"Incorrect address", //7
		"Endereço incorreto",
                "O Waze não nos enviou informações o suficiente para corrigirmos o problema reportado. Poderia especificar qual o destino que você colocou no Waze? Qual o problema que você teve com esse endereço? Obrigado!",
		"Open",

                //"Incorrect route", //8
                "Rota Incorreta",
		"O Waze não nos enviou informações o suficiente para corrigirmos o problema reportado. Poderia nos dizer o que houve de errado com a rota que o Waze lhe deu? Obrigado!",
		"Open",

                //"Missing roundabout", //9
		"Rotunda em falta",
                "Caro Wazer, por favor nos informe entre quais cruzamentos há uma rotunda. Obrigado!",
                "Open",

                //"General error", //10
                "Erro geral no mapa",
		"Caro Wazer! Não foi possível compreender o problema reportado. Poderia nos fornecer mais detalhes, por favor?",
    		"Open",

                //"Turn not allowed", //11
                "Curva proibida",
		"Caro wazer, examinei o seu pedido de correcção. Contudo não consegui verificar a origem do erro. Peço que me envie mais informações acerca do problema encontrado. Obrigado.",
                "Open",

                //"Incorrect junction", //12
                "Cruzamento incorreto",
		"O Waze não nos enviou informações o suficiente para corrigirmos o problema reportado. Poderia nos dizer o que houve de errado com a rota que o Waze lhe deu? Qual o destino que você colocou no Waze? Obrigado!",
		"Open",

                //"Missing bridge overpass", //13
                "Ponte ou viaduto em falta",
		"Poderia nos dizer qual a ponte ou viaduto que você acredita que seja inexistente? Quando dirigindo em velocidades de rodovias, o Waze deliberadamente não mostra alguns pontos próximos para evitar poluição visual na tela. Por favor nos informe o máximo possível sobre essa erro. Obrigado!",
                "Open",

                //"Wrong driving direction", //14
		"Sentido de condução incorreto",
                "Por favor nos informe o que houve de errado com a rota que o Waze lhe deu. Poderia nos dizer qual o destino que você entrou no Waze? Obrigado",
                "Open",

                //"Missing Exit", //15
                "Saída em falta",
		"Por favor nos informe o máximo de detalhes possível sobre essa saída inexistente. Obrigado!",
                "Open",

                //"Missing Road", //16
                "Estrada em falta",
		"Poderia nos informar o máximo possível sobre a estrada que acredita que esteja em falta pois no mapa diponível não temos indicação de nada? Obrigado!",
                "Open",

                //"Missing Landmark", //18
                "Ponto de interesse em falta",
		"Caro Wazer, poderia nos dizer qual o ponto de interesse em falta! Lembre-se que você pode adicioná-lo direto pelo aplicativo. Obrigado",
                "Open"
//End of Default URs
];
//end PortugalPortuguese list