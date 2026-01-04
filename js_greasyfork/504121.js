// ==UserScript==ss
// @name         Swordz.io Hack 2
// @namespace    Reiwilo09
// @version      1.3
// @description  Hack game
// @author       Reiwilo
// @match        *.swordz.io
// @grant        ur mum
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504121/Swordzio%20Hack%202.user.js
// @updateURL https://update.greasyfork.org/scripts/504121/Swordzio%20Hack%202.meta.js
// ==/UserScript==
// @license MIT
 
var spam = false;
var showScore = false;
var aimbot = false;
var line = false;
var multibot = false;
var backspeed = false;
var copyNicks = false;
var mouseX = 0;
var mouseY = 0;
var x;
var y;
let focused;
const input = document.createElement('input')
input.style.width = '200px'
input.style.marginTop = '15px'
input.style.height = '60px'
input.style.borderRadius = '10px'
input.placeholder = 'Enter spam message'
input.onfocus = function() {
    focused = true
}
input.onblur = function() {
    focused = false
}
    
document.querySelector('td').appendChild(input)
 
const copynicknames = document.createElement('div')
copynicknames.style.backgroundColor = '#000'
copynicknames.style.width = '120px'
copynicknames.style.height = '205px'
copynicknames.style.borderRadius = '15px'
copynicknames.style.opacity = '0.7'
copynicknames.innerHTML = '<ol> <li> <button onclick="copyName(0)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> <li>  <button onclick="copyName(1)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> <li> <button onclick="copyName(2)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> <li> <button onclick="copyName(3)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> <li> <button onclick="copyName(4)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> <li> <button onclick="copyName(5)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> <li> <button onclick="copyName(6)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> <li> <button onclick="copyName(7)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> <li> <button onclick="copyName(8)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> <li> <button onclick="copyName(9)" style="background-color: #A871FF; color: white; border: none; border-radius: 5px; width: 80px;">Copy</button> </li> </ol>'
 
document.querySelector('td').appendChild(copynicknames)

function onUpdate() {
     if(spam) {
         if(input.value != ''){
            socket.emit('keyPressX', {
               inputId: 'chatMessage',
               state: input.value
            })
         } else {
             socket.emit('keyPressX', {
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
                  var scorekilled = Math.round(Player.list[playerId].score * 30 / 100 + Player.list[selfId].score)
                  var procent;
                  if(Player.list[playerId].level < 34) {
                       procent = Math.floor((Player.list[playerId].score - 250 * Math.pow(1.3, Player.list[playerId].level - 2) + 193) * 100 / (250 * (Math.pow(1.3, Player.list[playerId].level - 1) - Math.pow(1.3, Player.list[playerId].level - 2))));
                  } else {
                     procent = 100
                  }
                  ctx.fillStyle = 'white'
                  ctx.fillText('Score: ' + Player.list[playerId].score + ` (${procent}%)`, WIDTH / 2 + distanceX - 60, HEIGHT / 2 + distanceY + 75)
                  if(playerId != selfId) {
                      ctx.fillStyle = '#ddd'
                      ctx.fillText('Kill = ' + `${scorekilled}`, WIDTH / 2 + distanceX - 40, HEIGHT / 2 + distanceY + 95)
                  }
               }
            }
            for(var npcId in NPC.list) {
                if(NPC.list[npcId].x > -100000) {
                    var distanceX = NPC.list[npcId].x - Player.list[selfId].x
                    var distanceY = NPC.list[npcId].y - Player.list[selfId].y
                    var procent = Math.floor((NPC.list[npcId].score - 250 * Math.pow(1.3, NPC.list[npcId].level - 2) + 193) * 100 / (250 * (Math.pow(1.3, NPC.list[npcId].level - 1) - Math.pow(1.3, NPC.list[npcId].level - 2))));
                    var scorekilled = Math.round(NPC.list[npcId].score * 30 / 100 + Player.list[selfId].score);
                    ctx.fillStyle = 'white'
                    ctx.fillText('Score: ' + NPC.list[npcId].score + ` (${procent}% bot)`, WIDTH / 2 + distanceX - 70, HEIGHT / 2 + distanceY + 75)
                    ctx.fillStyle = '#ddd'
                    ctx.fillText('Kill = ' + `${scorekilled}`, WIDTH / 2 + distanceX - 40, HEIGHT / 2 + distanceY + 95)
                }
            } 
       }
       if(aimbot) {
           for(var playerId in Player.list) {
               if(playerId != selfId) {
                   var x = Player.list[playerId].x - Player.list[selfId].x
                   var y = Player.list[playerId].y - Player.list[selfId].y
                   var current = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
                   if(document.getElementById('modeButton').innerText == 'Food') {    
                       if(Player.list[selfId].level >= Player.list[playerId].level) {
                           if(current < 550) {
                               socket.emit('keyPressX', {
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
               } else {
                    if(current < 500) {
                        socket.emit('keyPressX', {
                            inputId: 'angle',
                            state: Math.atan2(y, x) * 180 / Math.PI
                        })
                        if(Player.list[selfId].level < 10) {
                            if(current < 280) {
                                inputAttack(true)
                            } else {
                                inputAttack(false)
                            }
                        } else if(Player.list[selfId].level >= 10 && Player.list[selfId].level < 20) {
                            if(current < 320) {
                                inputAttack(true)
                            } else {
                                inputAttack(false)
                            }
                        } else if(Player.list[selfId].level >= 20 && Player.list[selfId].level < 27) {
                            if(current < 360) {
                                inputAttack(true)
                            } else {
                                inputAttack(false)
                            }
                        } else {
                            if(current < 400) {
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
                   socket.emit('keyPressX', {
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
       if(line && Player.list[selfId] != undefined) {
        for(var playerId in Player.list) {
            if(playerId != selfId) {
                var target = Player.list[playerId];
                var diffX = target.x - Player.list[selfId].x;
                var diffY = target.y - Player.list[selfId].y;
                var currentDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
                if(currentDistance != undefined && !isNaN(currentDistance) && currentDistance <= 1000) {
                    ctx.beginPath();
                    ctx.moveTo(WIDTH / 2, HEIGHT / 2);
                    ctx.arc(WIDTH / 2, HEIGHT / 2, 1, 0, 2 * Math.PI, true);
                    ctx.lineTo(diffX + WIDTH / 2, diffY + HEIGHT / 2);
                    ctx.arc(diffX + WIDTH / 2, diffY + HEIGHT / 2, 1, 0, 2 * Math.PI, true);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#e74c3c";
                    ctx.stroke();
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
       for(var i in Player.list) {
         if(String(Player.list[i].score).slice(0, 
            String(Player.list[i].score).length - 3) + "K" == Player.leaderboardScore[0]) {
             id = i
             x = Player.list[id].x
             y = Player.list[id].y
                    ctx.beginPath(),
        ctx.arc(WIDTH - 155 + 140 * x / mapWIDTH, HEIGHT - 60 - 155 + 140 * y / mapHEIGHT, 5.5, 0, 2 * Math.PI),
        ctx.fillStyle = '#ff0000',
        ctx.fill(),
        ctx.lineWidth = 5,
        ctx.strokeStyle = '#333',
        ctx.stroke();
    }
    }
    if(backspeed) {
            aimbot = false
            multibot = false
            socket.emit('keyPressX', {
                inputId: 'angle',
                state: ((mouseAngle + 180) % 360)
            });
    }
       requestAnimationFrame(onUpdate)
}
onUpdate()
function copyName(topNumber) {
    var topper = document.createElement('input')
    topper.value = Player.leaderboardUsername[topNumber]
    topper.select()
    navigator.clipboard.writeText(topper.value)
}
document.onkeydown = function(e) {
    if(!typing && !focused) {
      switch(e.keyCode) {
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
        case 82:
              if(Player.list[selfId].map == 1) {
                  secAfterDeath = 0
                  togglePause()
              } else if(secAfterDeath > 5) {
                  document.getElementById('signDiv-signIn').click()
              }
              break;   
          case 68:
              backspeed = true
              break;
          case 65:
              copyNicks = !copyNicks
              break;
       }
    }
}
document.onkeyup = function(e) {
    if(!focused) {
        switch(e.keyCode) {
            case 87:
                inputAttack(false)
                break;
            case 68:
                backspeed = false
                socket.emit('keyPressX', {
                    inputId: 'angle',
                    state: mouseAngle
                });
                break;
            case 13:
                inputChat()
                break;
        }
    }
}
addEventListener('mousemove', function (position) {
    mouseX = position.x
    mouseY = position.y
})
addEventListener('mousedown', function (e) {
    for(var idPlayer in Player.list) {
        var currentX = Player.list[idPlayer].x - Player.list[selfId].x
        var currentY = Player.list[idPlayer].y - Player.list[selfId].y
        var centerX = WIDTH / 2
        var centerY = HEIGHT / 2
        if(centerX + currentX < mouseX && centerX + currentX + 100 > mouseX && centerY + currentY < mouseY && centerY + currentY + 100 > mouseY && copyNicks) {
            var nick = document.createElement('input')
            nick.value = Player.list[idPlayer].username
            nick.select()
            navigator.clipboard.writeText(nick.value)
        }
    }
})
function onRender() {
    ctx.font = "20px Comic Sans MS";
    ctx.textAlign = "center";
    
    ctx.fillStyle = 'red'
    ctx.fillText('Pause/Respawn[R]', 120, 140)
    
    ctx.fillStyle = spam? 'green' : 'red'
    ctx.fillText('Spam[P]', 120, 165)
    
    ctx.fillStyle = showScore? 'green' : 'red'
    ctx.fillText('ShowScore[S]', 120, 190)
    
    ctx.fillStyle = aimbot? 'green' : 'red'
    ctx.fillText('Aimbot[E]', 120, 215)
    
    ctx.fillStyle = line? 'green' : 'red'
    ctx.fillText('Tracers[Q]', 120, 240)
    
    ctx.fillStyle = multibot? 'green' : 'red'
    ctx.fillText('Multibot[T]', 120, 265)
 
    ctx.fillStyle = backspeed? 'green' : 'red'
    ctx.fillText('BackSpeed[D]', 120, 290)
 
    ctx.fillStyle = copyNicks? 'green' : 'red'
    ctx.fillText('CopyNicks[A]', 120, 315)
 
    requestAnimationFrame(onRender)
}
onRender()