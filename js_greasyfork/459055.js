// ==UserScript==
// @name         Swordz.io lol
// @namespace    Reiwilo09
// @version      1.4.0
// @description  Hack game
// @author       Reiwilo
// @match        *.swordz.io
// @grant        ur mum
// @downloadURL https://update.greasyfork.org/scripts/459055/Swordzio%20lol.user.js
// @updateURL https://update.greasyfork.org/scripts/459055/Swordzio%20lol.meta.js
// ==/UserScript==
// @license MIT
 
var respawn = false;
var spam = false;
var showScore = false;
var aimbot = false;
var line = false;
var multibot = false;
let focused;
const input = document.createElement('input')
input.style.width = '200px'
input.style.marginTop = '15px'
input.style.height = '60px'
input.placeholder = 'Enter spam message'
input.onfocus = function() {
    focused = true
}
input.onblur = function() {
    focused = false
}
    
document.querySelector('td').appendChild(input)
 
function onUpdate() {
    if(respawn && document.getElementById('homeDiv').style.display === 'block') {
        document.getElementById('signDiv-signIn').click()
     } else {
        deathTimer = 60;
     }
     if(spam) {
         if(input.value != ''){
            socket.emit('keyPress', {
               inputId: 'chatMessage',
               state: input.value
            })
         } else {
             socket.emit('keyPress', {
                 inputId: 'chatMessage',
                 state: 'Subscribe to Reiwilo Kineim!'
             })
         }
     }
     if(showScore) {
             for(var playerId in Player.list) {
                if(Player.list[playerId].x > -100000) {
                  var distanceY = Player.list[playerId].y - Player.list[selfId].y
                  var distanceX = Player.list[playerId].x - Player.list[selfId].x
                  var procent;
                  if(Player.list[playerId].level < 34) {
                       procent = Math.floor((Player.list[playerId].score - 250 * Math.pow(1.3, Player.list[playerId].level - 2) + 193) * 100 / (250 * (Math.pow(1.3, Player.list[playerId].level - 1) - Math.pow(1.3, Player.list[playerId].level - 2))));
                  } else {
                     procent = 100
                  }
                  ctx.fillStyle = 'white'
                  ctx.fillText('Score: ' + Player.list[playerId].score + ` (${procent}%)`, WIDTH / 2 + distanceX - 70, HEIGHT / 2 + distanceY + 75)
                }
            }
            for(var npcId in NPC.list) {
                if(NPC.list[npcId].x > -100000) {
                    var distanceX = NPC.list[npcId].x - Player.list[selfId].x
                    var distanceY = NPC.list[npcId].y - Player.list[selfId].y
                    var procent = Math.floor((NPC.list[npcId].score - 250 * Math.pow(1.3, NPC.list[npcId].level - 2) + 193) * 100 / (250 * (Math.pow(1.3, NPC.list[npcId].level - 1) - Math.pow(1.3, NPC.list[npcId].level - 2))));
                    ctx.fillStyle = 'white'
                    ctx.fillText('Score: ' + NPC.list[npcId].score + ` (${procent}%)`, WIDTH / 2 + distanceX - 70, HEIGHT / 2 + distanceY + 75)
                }
            } 
       }
       if(aimbot) {
           for(var playerId in Player.list) {
               if(playerId != selfId) {
                   var x = Player.list[playerId].x - Player.list[selfId].x
                   var y = Player.list[playerId].y - Player.list[selfId].y
                   var current = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
                   if(Player.list[selfId].level >= Player.list[playerId].level) {
                       if(current < 500) {
                           socket.emit('keyPress', {
                               inputId: 'angle',
                               state: Math.atan2(y, x) * 180 / Math.PI
                           })
                           if(Player.list[selfId].level > 20) {
                               if(current < 360) {
                                   inputAttack(true)
                               } else {
                                   inputAttack(false)
                               }
                           } else {
                               if(current < 280) {
                                   inputAttack(true)
                               } else {
                                   inputAttack(false)
                               }
                           }
                       } 
                   }              
               }
           }
           for(var npcId in NPC.list) {
               var x = NPC.list[npcId].x - Player.list[selfId].x
               var y = NPC.list[npcId].y - Player.list[selfId].y
               var current = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
               if(current < 500) {
                   socket.emit('keyPress', {
                       inputId: 'angle',
                       state: Math.atan2(y, x) * 180 / Math.PI
                   })
                   if(Player.list[selfId].level > 20) {
                       if(current < 360) {
                           inputAttack(true)
                       } else {
                           inputAttack(false)
                       }
                   } else {
                       if(current < 280) {
                           inputAttack(true)
                       } else {
                           inputAttack(false)
                       }
                   }
               }
           }
       }
       if(line) {
           for(var playerId in Player.list) {
               if(playerId != selfId) {
                    var diffX = Player.list[playerId].x - Player.list[selfId].x
                    var diffY = Player.list[playerId].y - Player.list[selfId].y
                    var currentDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
                        if(currentDistance < 710) {
                            if(Player.list[selfId].level >= Player.list[playerId].level) {
                                ctx.beginPath()
                                ctx.strokeStyle = '#00ff00'
                                ctx.arc(WIDTH / 2, HEIGHT / 2, 2, 0, Math.PI * 2)
                                ctx.lineTo(WIDTH / 2 + diffX, HEIGHT / 2 + diffY)
                                ctx.lineWidth = 4
                                ctx.arc(WIDTH / 2 + diffX, HEIGHT / 2 + diffY, 2, 0, Math.PI * 2)
                                ctx.closePath()
                                ctx.stroke()
                            } else {
                                ctx.beginPath()
                                ctx.strokeStyle = '#ff0000'
                                ctx.arc(WIDTH / 2, HEIGHT / 2, 2, 0, Math.PI * 2)
                                ctx.lineTo(WIDTH / 2 + diffX, HEIGHT / 2 + diffY)
                                ctx.lineWidth = 4
                                ctx.arc(WIDTH / 2 + diffX, HEIGHT / 2 + diffY, 2, 0, Math.PI * 2)
                                ctx.closePath()
                                ctx.stroke()
                            }
                    }
                }
            }
           for(var npcId in NPC.list) {
               var diffX = NPC.list[npcId].x - Player.list[selfId].x
               var diffY = NPC.list[npcId].y - Player.list[selfId].y
               var currentDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
               if(currentDistance < 710) {
                   if(Player.list[selfId].level >= NPC.list[npcId].level) {
                       ctx.beginPath()
                       ctx.strokeStyle = '#00ff00'
                       ctx.arc(WIDTH / 2, HEIGHT / 2, 2, 0, Math.PI * 2)
                       ctx.lineTo(WIDTH / 2 + diffX, HEIGHT / 2 + diffY)
                       ctx.arc(WIDTH / 2 + diffX, HEIGHT / 2 + diffY, 2, 0, Math.PI * 2)
                       ctx.closePath()
                       ctx.stroke()
                   } else {
                       ctx.beginPath()
                       ctx.strokeStyle = '#ff0000'
                       ctx.arc(WIDTH / 2, HEIGHT / 2, 2, 0, Math.PI * 2)
                       ctx.lineTo(WIDTH / 2 + diffX, HEIGHT / 2 + diffY)
                       ctx.arc(WIDTH / 2 + diffX, HEIGHT / 2 + diffY, 2, 0, Math.PI * 2)
                       ctx.closePath()
                       ctx.stroke()
                   }
               } 
           }
       }
       if(multibot) {
           for(var mobId in Mob.list) {
               var diffX = Mob.list[mobId].x - Player.list[selfId].x
               var diffY = Mob.list[mobId].y - Player.list[selfId].y
               var current = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
               if(current < 780) {
                    ctx.beginPath()
                    ctx.strokeStyle = '#ffff00'
                    ctx.arc(WIDTH / 2, HEIGHT / 2, 2, 0, Math.PI * 2)
                    ctx.lineTo(WIDTH / 2 + diffX, HEIGHT / 2 + diffY)
                    ctx.arc(WIDTH / 2 + diffX, HEIGHT / 2 + diffY, 2, 0, Math.PI * 2)
                    ctx.closePath()
                    ctx.stroke()
               }
               if(current < 500) {
                   socket.emit('keyPress', {
                       inputId: 'angle',
                       state: Math.atan2(diffY, diffX) * 180 / Math.PI
                   })
                   if(Player.list[selfId].level > 20) {
                       if(current < 360) {
                           inputAttack(true)
                       } else {
                           inputAttack(false)
                       }
                   } else {
                       if(current < 280) {
                           inputAttack(true)
                       } else {
                           inputAttack(false)
                       }
                   }
               }
           }
       }
       requestAnimationFrame(onUpdate)
}
onUpdate()
document.onkeydown = function(e) {
    if(!typing && !focused) {
      switch(e.keyCode) {
         case 68:
            respawn = !respawn
            break;
         case 87:
            inputAttack(true)
            break;
        case 80:
            spam = !spam
            break;
        case 69:
            aimbot = !aimbot
            break;
        case 83:
            showScore = !showScore
            break;
        case 81:
            line = !line
            break;
        case 84:
            multibot = !multibot
            break;
       }
    }
}
 
function onRender() {
    ctx.fillStyle = respawn? 'green': 'red'
    ctx.fillText('Auto Respawn[D]', 120, 140)
    
    ctx.fillStyle = spam? 'green' : 'red'
    ctx.fillText('Spam[P]', 120, 165)
    
    ctx.fillStyle = showScore? 'green' : 'red'
    ctx.fillText('ShowScore[S]', 120, 190)
    
    ctx.fillStyle = aimbot? 'green' : 'red'
    ctx.fillText('Aimbot[E]', 120, 215)
    
    ctx.fillStyle = line? 'green' : 'red'
    ctx.fillText('Line[Q]', 120, 240)
    
    ctx.fillStyle = multibot? 'green' : 'red'
    ctx.fillText('Multibot[T]', 120, 265)
 
        ctx.beginPath(),
        ctx.arc(WIDTH - 155 + 140 * Player.leaderboardTopX / mapWIDTH, HEIGHT - 60 - 155 + 140 * Player.leaderboardTopY / mapHEIGHT, 5.5, 0, 2 * Math.PI),
        ctx.fillStyle = '#ff0000',
        ctx.fill(),
        ctx.lineWidth = 5,
        ctx.strokeStyle = '#333',
        ctx.stroke();
    requestAnimationFrame(onRender)
}
onRender()