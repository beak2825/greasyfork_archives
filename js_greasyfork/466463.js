// ==UserScript==
// @name         BRSociety MentionNotifier Plugin
// @namespace    https://brsociety.club/
// @version      1.1
// @description  Plugin para receber notificação visual e sonora quando alguém mencionar seu nome de usuário.
// @author       Anekin
// @match        https://brsociety.club/
// @icon         https://brsociety.club/img/logo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466463/BRSociety%20MentionNotifier%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/466463/BRSociety%20MentionNotifier%20Plugin.meta.js
// ==/UserScript==
// Criado por: https://brsociety.club/users/anekin

// CONFIGURAÇÃO DO PLUGIN

const notifyAliases = [ ] // <- Insira seus apelidos adicionais aqui, separados por vírgula e com aspas

// FIM DA CONFIGURAÇÃO. NÃO ALTERE AS LINHAS ABAIXO, A MENOS QUE SAIBA O QUE ESTÁ FAZENDO!!

let hasNotificationPermission = false

// Aviso de boas vindas e pedido de permissão para enviar notificações
const promptForNotificationPermission = () => {
  return new Promise((resolve) => {
    if (Notification.permission === 'default') {
      alert('Obrigado por instalar o MentionNotifier! Para que o plugin funcione corretamente, feche este aviso e aceite o envio de notificações. Boa conversa!')
    }

    Notification.requestPermission((permission) => {
      hasNotificationPermission = permission === 'granted'
      resolve()
    })
  })
}

// Adiciona o listener para verificar todas as mensagens recebidas
const setupIncomingMessagesListener = () => {
  // Caso o usuário não tenha dado permissão para o envio de notificações,
  // nem configura o listener para poupar recursos da máquina
  if (!hasNotificationPermission) return

  // Pega o nome do usuário atual através do link da imagem presente na barra de navegação.
  const [username] = document.getElementsByClassName('top-nav__dropdown--nontouch')[2].getAttribute('href').split('/').toReversed()
  notifyAliases.push(username)

  // Para cada mensagem recebida, irá executar a função "checkIncomingMessageAndNotifyUser"
  window.Echo.connector.channels['presence-chatroom.1'].listeners['new.message'].push(
    (event) => checkIncomingMessageAndNotifyUser(event, username)
  )
}

function checkIncomingMessageAndNotifyUser(event, username) {
  const userMentionString = `@${username}`
  const sender = event.message.user.username

  // Extrai a mensagem do event websocket, removendo todas as tags HTML de estilização
  let message = event.message.message.replace(/<[^>]*>/g, '')
  let messageTitle = `${sender} mencionou você!`

  // Caso a mensagem atual não possua menção do usuário, interrompe o fluxo de notificação
  if (!notifyAliases.some((a) => message.toLowerCase().includes(a.toLowerCase())) ) {
    return
  }

  // Caso o remetente tenha mencionado @usuario sem digitar nenhuma mensagem,
  // define um texto e título padrão
  if (message.toLowerCase() === userMentionString.toLowerCase()) {
    message = `${sender} mencionou você, mas não escreveu nada`
    messageTitle = 'Um carente foi detectado!'
  }

  // Caso a mensagem comece com @usuario, remove o texto "@usuario" da notificação para
  // deixar a leitura mais dinâmica
  if (message.startsWith(userMentionString)) {
    message = message.replace(userMentionString, '').trim()
  }

  // Toca o áudio da notificação
  new Audio('https://cms-public-artifacts.artlist.io/content/sfx/aac/71517_551919_551918_Ni_Sound_Animal_Forest_UI_Japanese_Button_Tap_FX_Sound_04-01_normal.aac').play()

  // Caso o usuário esteja com o chat aberto, não envia a notificação
  if (document.visibilityState === 'visible' && document.hasFocus()) {
    return
  }

  const notification = new Notification(messageTitle, { body: `${message}`, icon: 'https://brsociety.club/img/logo.png' })

  // Limpa a notificação quando o usuário visualizar o chat
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      notification.close()
    }
  })
}

(async function() {
  await promptForNotificationPermission()
  setupIncomingMessagesListener()
})()
