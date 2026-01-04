// ==UserScript==
// @name         Bot
// @namespace    http://tampermonkey.net/
// @version      0.8.9
// @description  try to take over the world!
// @author       Llane
// @include https://*.the-west.*/game.php*
// @downloadURL https://update.greasyfork.org/scripts/421600/Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/421600/Bot.meta.js
// ==/UserScript==

(function() {
   class Praca {
       constructor(x,y,id,time,silver) {
           this.x = x;
           this.y = y;
           this.id = id;
           this.time = time;
           this.silver = silver;
       }
   }
    class JobData{
        constructor(x,y,id,time,silver,xp,money,motivation,luckMin,luckMax,stopMotivation) {
            this.x = x;
            this.y = y;
            this.id = id;
            this.time = time;
            this.silver = silver;
            this.xp = xp;
            this.money = money;
            this.motivation = motivation;
            this.luckMin = luckMin;
            this.luckMax = luckMax;
            this.stopMotivation = stopMotivation;
        }
    }
    Bot = {
    sortByExp: 1,
    sortByMoney:0,
    sortByMotivation:0,
    sortByDistance:0,
    pridane:new Array(),
    prace:[],
    jsonCoordinates:null,
    stopBot:false,
    startPoint:0,
    direction:false,
    numberOfJobsClicked:0,
    sets:null,
    travelSet:-1,
    jobSet:-1,
    healthSet:-1,
    comboBoxSelectedSet:0,
    lang:null,
    bestEquip:new Array(),
    allowHp: false,
    allowMotivation:false,
    allowEnergy:false,
    checkedMotivation:false,
    madeSequence:false,
    languages: {
        cs_CZ: {
            energySearch:"zvýšení energie",
            motivationSearch:"zvýšení pracovní motivace",
            hpSearch:"bonus zdraví"
        },
        sk_SK: {
            energySearch:"zvýšenie energie",
            motivationSearch:"zvýšenie pracovnej motivácie",
            hpSearch:"bonus bodov zdravia"
          },
        en_DK: {
            energySearch:"energy increase",
            motivationSearch:"work motivation increase",
            hpSearch:"health point bonus"
        }
    }
    };

    Bot.spravGui = function() {
            
             var content = $('<div class=\'botwindow\'/>');
        var table = Bot.spravTabulku(this.sortByExp,this.sortByMoney,this.sortByMotivation,this.sortByDistance);
            var win = wman.open('bot').setResizeable(true).setMinSize(750, 475).setSize(750, 475).setMiniTitle("Bot");

        var tabClickLogic = function (win, id) {
                switch (id) {
                    case "prehlad":
                        $('div.tw2gui_window_tab', this.divMain).removeClass('tw2gui_window_tab_active');
                        $('div._tab_id_prehlad', this.divMain).addClass('tw2gui_window_tab_active');

                        Bot.loadJobs(function() {
                        var table = Bot.spravTabulku(this.sortByExp,this.sortByMoney,this.sortByMotivation,this.sortByDistance);
                        content.append(table.getMainDiv());
                        win.appendToContentPane(content);
                        Bot.addColumnCss();
                        Bot.addHeaderEvent();
                        Bot.refreshWindow();
                        });
                        break;
                    case "pridane":
                        $('div.tw2gui_window_tab', this.divMain).removeClass('tw2gui_window_tab_active');
                        $('div._tab_id_pridane', this.divMain).addClass('tw2gui_window_tab_active');
                        win.getMainDiv.remove;
                        var table = Bot.makeAddedJobsTable();
                        content.append(table.getMainDiv());
                        win.appendToContentPane(content);
                        Bot.addColumnCss();
                        Bot.refreshTab2();
                        break;
                    case "supravy":
                        $('div.tw2gui_window_tab', this.divMain).removeClass('tw2gui_window_tab_active');
                        Bot.getSets(function() {
                            Bot.checkIfRightSet();
                             content.append(Bot.makeSetsUi());
                        win.appendToContentPane(content);
                        Bot.refreshTab3();
                        });

                        $('div._tab_id_supravy', this.divMain).addClass('tw2gui_window_tab_active');
                        break;
                    case "statistika":
                        $('div.tw2gui_window_tab', this.divMain).removeClass('tw2gui_window_tab_active');
                        $('div._tab_id_statistika', this.divMain).addClass('tw2gui_window_tab_active');
                        content.append(Bot.createStatistic());
                        win.appendToContentPane(content);
                        Bot.refreshTab4();
                        break;
                }

            };


        var tabs = {
                "prehlad": 'Prehľad prác',
                "pridane": 'Pridané práce',
                "supravy": 'Súpravy'//,
                //"statistika": 'Prehľad'
            };
            for(var t in tabs) {
                win.addTab(tabs[t],t,tabClickLogic);
            }
             content.append(table.getMainDiv());
            win.appendToContentPane(content);
        Bot.addColumnCss();
        this.addHeaderEvent();
    }
     Bot.getJobIcon = function(x,y,meno,silver) {
         var c = '';
         if(silver) {
             c = '<div class="featured silver"></div>';
            }
          return '<div class="job" style="left: 0; top: 0; position: relative;"><div  onclick="" class="featured"></div>' +c + '<img src="../images/jobs/' + meno + '.png" class="job_icon"></div>';

    }
     Bot.getItemIcon = function(shortName) {
         return '<div class="tw_item item_inventory_img" style="left: 0; top: 0; position: relative;"><div  onclick="" class="featured"></div><img src="https://westen.innogamescdn.com/images/items/yield/' + shortName + '.png"></div>';

     }
      Bot.loadJobsC = function(callback) {
        Ajax.get('map','get_minimap',{},function(r) {
            if(r.error) {
                console.log(r.error);
                return;
            }
            Bot.jsonCoordinates = r;
            callback();
        });
    }
     Bot.getJobName = function(id) {
         return JobList.getJobById(id).name;
     }
      Bot.getJobIconName = function(id) {
          if(id == 81 || id == 89 || id >160) {
              console.log('id zlej ikony ' + id);
             }
         return JobList.getJobById(id).shortname;
     }

      Bot.getJobData = function(x,y,id,time,silver) {
         var cd = id;
          var b = JobsModel.Jobs[id];
          var xp = b.basis['short'].experience;
          var money =b.basis['short'].money;
          var motivation = b.jobmotivation*100;
          var minLuck =b.luck[0];
          var maxLuck =b.luck[1];
          if(silver) {
              xp +=(0.5*xp);
              money +=(0.5*money);
             }
           if(id <= 79) {
               cd++;
              }else if(id > 79 && id <= 86) {
                  cd +=2;
              }else {
                  cd+=3;
              }
          return new JobData(x,y,cd,time,silver,xp,money,motivation,minLuck,maxLuck,75);
      }
      Bot.getClosestJobs = function(sortByExperience,sortByMoney,sortByMotivation,sortByDistance) {
          var jobs = Bot.prace;
          var b = Array(162).fill(null);
          var job;
          var a;

          for(a in jobs) {

              job = jobs[a];
              if(Bot.pridane != null) {
                  var alreadyAdded = false;
                  for(var i = 0 ; i < Bot.pridane.length;i++) {
                      if(Bot.pridane[i].id == job.id) {
                          alreadyAdded = true;
                          break;
                         }
                  }
                  if(alreadyAdded) {
                      alreadyAdded = false;
                      continue;
                  }
              }
              if(JobList.getJobById(job.id) == undefined) {
                  break;
                 }
              var travelTime = this.calcDistance(job.x,job.y);
              job.time = travelTime;
              var isSilver = this.checkIfFeatured(job.x,job.y,job.id);
              job.silver = isSilver;

             

               var eff = JobList.getJobById(job.id).canDo();

              if(eff && (b[job.id] == null || (job.silver && !b[job.id].silver)|| (job.time < b[job.id].time &&((job.silver && b[job.id].silver)||(!job.silver &&!b[job.id].silver)))  )) {
                  var cd = job.id;
                  if(job.id <= 80) {
                      cd--;
                   }else if(job.id <= 88 && job.id > 80) {
                       cd -=2
                   }else {
                       cd-=3
                   }
                  b[job.id] = this.getJobData(job.x,job.y,cd,job.time,job.silver);
              }
          }
          var experienceSort = function(a,b) {
              if(a == null && b == null) {
                  return 0;
              }
              if(a == null && b != null) {
                  return 1;
              }
              if(a != null && b == null) {
                  return -1;
              }
              var a1 = a.xp;
              var b1 = b.xp;
              return (a1 > b1) ? -1 :(a1 < b1) ? 1 :0;
          };
          var reverseExperienceSort = function(a,b) {
              if(a == null && b == null) {
                  return 0;
                 }
              if(a == null && b != null) {
                  return -1;
              }
              if(a != null && b == null) {
                  return 1;
              }
              var a1 = a.xp;
              var b1 = b.xp;
              return (a1 > b1) ? 1 :(a1 < b1) ? -1 :0;
          };

          var moneySort = function(a,b) {
              if(a == null && b == null) {
                  return 0;
              }
              if(a == null && b != null) {
                  return 1;
              }
              if(a != null && b == null) {
                  return -1;
              }
              var a1 = a.money;
              var b1 = b.money;
              return (a1 > b1) ? -1 :(a1 < b1) ? 1 :0;
          };
          var reverseMoneySort = function(a,b) {
             if(a == null && b == null) {
                  return 0;
                 }
              if(a == null && b != null) {
                  return -1;
              }
              if(a != null && b == null) {
                  return 1;
              }
              var a1 = a.money;
              var b1 = b.money;
              return (a1 > b1) ? 1 :(a1 < b1) ? -1 :0;
          };

          var motivationSort = function(a,b) {
              if(a == null && b == null) {
                  return 0;
              }
              if(a == null && b != null) {
                  return 1;
              }
              if(a != null && b == null) {
                  return -1;
              }
              var a1 = a.motivation;
              var b1 = b.motivation;
              return (a1 > b1) ? -1 :(a1 < b1) ? 1 :0;
          };
           var reverseMotivationSort = function(a,b) {
             if(a == null && b == null) {
                  return 0;
                 }
              if(a == null && b != null) {
                  return -1;
              }
              if(a != null && b == null) {
                  return 1;
              }
              var a1 = a.motivation;
              var b1 = b.motivation;
              return (a1 > b1) ? 1 :(a1 < b1) ? -1 :0;
          };

          var distanceSort = function(a,b) {
              if(a == null && b == null) {
                  return 0;
              }
              if(a == null && b != null) {
                  return 1;
              }
              if(a != null && b == null) {
                  return -1;
              }
              var a1 = a.time;
              var b1 = b.time;
              return (a1 > b1) ? -1 :(a1 < b1) ? 1 :0;
          };
           var reverseDistanceSort = function(a,b) {
             if(a == null && b == null) {
                  return 0;
                 }
              if(a == null && b != null) {
                  return -1;
              }
              if(a != null && b == null) {
                  return 1;
              }
              var a1 = a.time;
              var b1 = b.time;
              return (a1 > b1) ? 1 :(a1 < b1) ? -1 :0;
          };
          if(sortByExperience == 1) {
              b.sort(experienceSort)
            }
          if(sortByExperience == -1) {
              b.sort(reverseExperienceSort);
            }
          if(sortByMoney == 1) {
              b.sort(moneySort);
             }
          if(sortByMoney ==-1) {
              b.sort(reverseMoneySort);
             }
          if(sortByMotivation == 1) {
              b.sort(motivationSort);
             }
          if(sortByMotivation == -1) {
              b.sort(reverseMotivationSort);
             }
          if(sortByDistance == 1) {
              b.sort(distanceSort);
             }
          if(sortByDistance == -1) {
              b.sort(reverseDistanceSort);
             }
          return b;
      }
      Bot.checkIfFeatured = function(x,y,id) {
          var arr = Map.JobHandler.Featured;
          var a;
          var b;
          for(a in arr) {
              var jobs = arr[a];
              for(b in jobs) {
                  var e = jobs[b];
                  if(e.x == x && e.y == y && e.job_id == id) {
                      if(e.silver) {
                          return true;
                         }
                      
                  }
              }
          }
          return false;

      }
      Bot.getMotivation = function(jobdata,callback) {
          Ajax.get('job','job',{jobId:jobdata.id,x:jobdata.x,y:jobdata.y},function(r) {
            if(r.error) {
                console.log(r.error);
                return;
            }
              Bot.Motivation = r.motivation*100;
            callback();
            
        });
      }
      Bot.haveMotivation = function(a) {
          Bot.getMotivation(a,function(){
          Bot.checkedMotivation = true;
          });
      }

        Bot.run =  async function() {
            
              while(Bot.stopBot) {

                  if(Bot.pridane.length == 0) {
                      Bot.stopBot = false;
                      break;

               }
                  var underMotivation = false;
                  for(var i =0;i< Bot.pridane.length;i++){
                      Bot.haveMotivation(Bot.pridane[i]);
                      while(true) {
                          if(Bot.checkedMotivation) {
                              break;
                          }
                      await new Promise(r => setTimeout(r, 50));
                  }
                      Bot.pridane[i].motivation = Bot.Motivation;
                      if(Bot.pridane[Bot.startPoint].motivation == Bot.pridane[Bot.startPoint].stopMotivation) {
                          underMotivation = true;
                      }
                      Bot.checkedMotivation = false;
                  }

                    var oldDirection = Bot.direction;
                    var oldPoint = Bot.startPoint;
               
                    let promise = await Bot.runJobSequence(Bot.pridane[Bot.startPoint]);
                    if(promise == 1) {
                        if(!Bot.direction) {
                            if(Bot.pridane.length -1== Bot.startPoint) {
                                Bot.direction = true;
                               }else {
                                 Bot.startPoint++;
                               }
                           }else {
                               if(Bot.startPoint == 0) {
                                   Bot.direction = false;
                                  }else {
                               Bot.startPoint--;
                                  }
                           }
                      }
                  Bot.setCookies();
                  if(((Character.health/Character.maxHealth)*100) <= 10) {
                      if(!underMotivation) {
                         Bot.startPoint = oldPoint;
                         Bot.direction = oldDirection;
                          Bot.setCookies();
                          }
                           if(Bot.allowHp) {
                              while(true) {
                            let promise2 = await Bot.useItem(0);
                               if(promise2 == 0) {
                                   Bot.stopBot = false;
                                   alert('Bot skoncil hp pod 10%');
                                   return;
                               }
                                  if(promise2 == 1) {
                                      
                                      break;
                                  }
                           }
                  }else {
                      Bot.stopBot = false;
                      alert('Bot skoncil hp je pod 10%');
                      break;
                  }
                  }

                  if(Character.energy == 0) {
                      if(!underMotivation) {
                         Bot.startPoint = oldPoint;
                         Bot.direction = oldDirection;
                         Bot.setCookies();
                       }
                      if(Bot.allowEnergy) {
                          while(true) {
                      let promise2 = await Bot.useItem(2);
                          if(promise2 == 0) {
                              Bot.stopBot = false;
                              alert('Bot skoncil energia <= 0');
                              return;
                          }
                              if(promise2 == 1) {
                                  
                                  break;
                              }
                      }
                  }else {
                      Bot.stopBot = false;
                      alert('Bot skoncil energia je 0');
                      break;
                  }
                     }
                  var m = Bot.checkMotivation();
                  if(m) {
                      if(Bot.allowMotivation) {
                           let promise2 = await Bot.useItem(1);
                          if(promise2 == 0) {
                              Bot.stopBot = false;
                              alert('Bot skoncil motivacka <= 75');
                              break;
                          }
                          if(promise == 1) {
                              break;
                          }
                      }else {
                      Bot.stopBot = false;
                      alert('Bot skoncil motivacka <= 75');
                      break;
                  }

               }

        }
        }
        Bot.useItem = async function(type) {
            var item;
            var oldHp;
            var oldMotivation
            if(type == 0) {
                item = Bot.addHp();
                oldHp = Character.health;
            }else if(type == 1 && Bot.pridane.length != 0) {
                item = Bot.addMotivation();
                oldMotivation = Bot.pridane[0].motivation;
            }else {
                item = Bot.addEnergy();
            }
            if(item == null) {
                return 0;
            }
            while(true) {
               if(BuffList.cooldowns[item] == undefined ||!BuffList.cooldowns[item].time <= new ServerDate().getTime()  ) {
                   var r = window.confirm('Chces pouzit item ' + Bag.getItemByItemId(item).obj.name);
                   if(r) {
                       if(Bot.healthSet != -1 && type == 0) {
                           Bot.equipSet(Bot.healthSet);
                       }
                       ItemUse.doIt(item);
                       while(true) {
                           if(type == 0) {
                               if(oldHp != Character.health) {
                                   $(".tw2gui_dialog_framefix").remove();
                                   return 1;
                               }
                           }else if(type == 1) {
                               while(true) {
                                   let promise2 = await Bot.updateAddedMotivation();
                                   if(promise2 == 1 && Bot.pridane[0].motivation != oldMotivation) {
                                        $(".tw2gui_dialog_framefix").remove();
                                        return 1;
                                   }
                               }
                           }else {
                               if(Character.energy > 0) {
                                   $(".tw2gui_dialog_framefix").remove();
                                   return 1;
                               }
                           }
                            await new Promise(r => setTimeout(r, 50));
                       }
                   }else {
                       alert("Bot skoncil");
                       return 0;
                   }
               }
            }

        }
        Bot.checkMotivation = function() {
            for(var i = 0 ; i < Bot.pridane.length;i++) {
                if(Bot.pridane[i].motivation > Bot.pridane[i].stopMotivation || Bot.pridane[i].stopMotivation == 0) {
                    return false;
                   }
            }
            return true;
        }
        Bot.optimizeRoute = function() {
            if(Bot.pridane.length >= 2) {
            var a = Bot.pridane;
            var b = [];
            var index;
            var distance = 0;
            for(var i = 0 ; i < a.length;i++) {
                var d = Map.calcWayTime(Character.position,{x:a[i].x,y:a[i].y})
                if(d >= distance) {
                    distance = d;
                    index = i;
                   }
            }
            b.push(a[index]);
            a.splice(index,1);
            while(true) {
                distance = 100000;
                for(var p = 0; p < a.length;p++) {
                    var e = Map.calcWayTime({x:b[b.length-1].x,y:b[b.length-1].y},{x:a[p].x,y:a[p].y});
                    if(e <= distance) {
                        distance = e;
                        index = p;
                     }
                }
                b.push(a[index]);
                a.splice(index,1);
                if(a.length ==0) {
                    break;
                   }
            }
            Bot.pridane = b;
        }

        }
        Bot.createRoute = function() {
            var start = -1;
            var distance = 10000000;
            for(var m = 0 ; m < Bot.pridane.length;m++) {
                var d = Map.calcWayTime(Character.position,{x:Bot.pridane[m].x,y:Bot.pridane[m].y})
                if(d < distance) {
                    distance = d;
                    start = m;
                }
            }
            var costs = new Array(Bot.pridane.length);
            for(var o = 0 ; o < Bot.pridane.length;o++) {
                costs[o] = new Array(Bot.pridane.length);
            }

            for( var a = 0 ; a < Bot.pridane.length;a++) {
                for(var b = a; b < Bot.pridane.length;b++) {
                    var dis = Map.calcWayTime({x:Bot.pridane[a].x,y:Bot.pridane[a].y},{x:Bot.pridane[b].x,y:Bot.pridane[b].y});
                    costs[a][b] = dis;
                    costs[b][a] = dis;
                }
            }
            var n = Bot.pridane.length;
            var dp = new Array(1 << n);
            for(var c = 0 ; c < dp.length;c++) {
                dp[c] = new Array(n);
            }
            for(var f = 0 ; f < dp.length;f++) {
                for(var l = 0 ; l < dp[f].length;l++) {
                    dp[f][l] = Number.MAX_SAFE_INTEGER;
                }
            }
            var path = new Array(1 << n);
            for(var e = 0 ; e < dp.length;e++) {
                path[e] = new Array(n);
            }
            var last = -1, min = Number.MAX_SAFE_INTEGER;
            for (var i = 1; i < (1 << n); i++) {
            for (var j = 0; j < n; j++) {
                if ((i & (1 << j)) > 0) {
                    var prev = i - (1 << j);
                    if (prev == 0) {
                        dp[i][j] = costs[j][start];
                    } else {
                        for (var k = 0; k < n; k++) {
                            if (dp[prev][k] < Number.MAX_SAFE_INTEGER  && dp[prev][k] + costs[k][j] < dp[i][j]) {
                                dp[i][j] = dp[prev][k] + costs[k][j];
                                path[i][j] = k;
                            }
                        }
                    }
                }
                if (i == (1 << n) - 1 && dp[i][j] < min) {
                    min = dp[i][j];
                    last = j;
                }
            }
        }
           var cur = (1 << n) - 1;
        var stack = [];
        while (cur > 0) {
            stack.push(last);
            var temp = cur;
            cur -= (1 << last);
            last = path[temp][last];
        }
            var tempArr = [];
            while(stack.length > 0) {
                var ii = stack.pop();
                tempArr.push(Bot.pridane[ii]);
            }
            Bot.pridane = tempArr;


            
        }
        Bot.tsp = function(mask,pos,dist,dp,last) {
            var visitedall = (1 << dist.length) -1;
            if(mask == visitedall) {
                return dist[0][pos];
            }
            if(dp[mask][pos] != -1) {
                return dp[mask][pos];
            }
            var ans = Number.MAX_SAFE_INTEGER;
            for(var point = 0 ; point < dist.length; point++) {
               if((mask&(1 << point)) == 0) {
                   var n = dist[pos][point] + Bot.tsp(mask|(1<<point),point,dist,dp);
                   ans = Math.min(ans,n);
                   last = point;
               }
            }
            return dp[mask][pos]= ans;


        }
       
        Bot.calculateDistance = function() {
            var distance = 0;
            for(var i = 0 ; i < Bot.pridane.length-1;i++) {
                distance +=Map.calcWayTime({x:Bot.pridane[i].x,y:Bot.pridane[i].y},{x:Bot.pridane[i+1].x,y:Bot.pridane[i+1].y});
            }
            return distance;
        }


      Bot.updateMotivation = function(a) {
          for(var i = 0; i < Bot.pridane.length;i++) {
              if(a.id == Bot.pridane[i].id) {
                  Bot.pridane[i].motivation = a.motivation;
                  break;
                 }
          }
      }
      Bot.updateAddedMotivation = async function() {
          if(Bot.pridane.length == 0) {
              return 1;
           }
          var aktualna = 0;
         while(true) {
              Bot.haveMotivation(Bot.pridane[aktualna]);
              while(true) {
                  if(Bot.checkedMotivation) {
                      Bot.pridane[aktualna].motivation = Bot.Motivation;
                      Bot.checkedMotivation = false;
                      break;
                     }
                  await new Promise(r=>setTimeout(r,50));
              }
             aktualna++;
             if(Bot.pridane.length == aktualna) {
                 break;
             }
      }


          
          return 1;
      }
     

     
        Bot.runJobSequence = async function(a) {

          
             var maxNumberOfJobs;
              if(Premium.hasBonus('automation')) {
              maxNumberOfJobs = 9;
          }else {
              maxNumberOfJobs = 4;

          }
             while((a.stopMotivation == 0 ||a.motivation >a.stopMotivation) && Character.energy > 0 && Bot.stopBot) {
                  Bot.haveMotivation(a);
                  while(true) {
                if(Bot.checkedMotivation) {
                    break;
                   }
                    await new Promise(r => setTimeout(r,50));
                   }
                 Bot.checkedMotivation = false;
                 a.motivation = Bot.Motivation;
                 Bot.updateMotivation(a);
                 Bot.refreshTab2();
                 if(a.motivation <= a.stopMotivation && a.stopMotivation > 0) {
                     break;
                    }

                 //traveling clicked one job and waiting distance time +1
                 var distance = Map.calcWayTime(Character.position,{x:a.x,y:a.y});
                 if(distance != 0) {
                     //if travel set is defined than equip it
                     if(Bot.travelSet != -1) {
                         Bot.equipSet(Bot.travelSet);
                     }
                     //wait till you get to the job than cancel it
                     JobWindow.startJob(a.id,a.x,a.y,15);
                   //  await new Promise(r=>setTimeout(r,1000*(distance)));
                     while(true) {
                         var distance2 = Map.calcWayTime(Character.position,{x:a.x,y:a.y});
                         if(distance2 == 0) {
                             break;
                           }
                          await new Promise(r=>setTimeout(r,50));
                     }
                     if(TaskQueue.queue.length > 0) {
                     TaskQueue.cancelAll();
                 }

                   }

             
                   var jobTask = 0;

              if(a.motivation - a.stopMotivation >= maxNumberOfJobs) {
                  jobTask = maxNumberOfJobs;
                 }else{
                    jobTask = a.motivation -a.stopMotivation;
                }
                 if(a.stopMotivation == 0) {
                     jobTask = maxNumberOfJobs;
                    }
              var addedJobs = jobTask - TaskQueue.queue.length;
              addedJobs = Math.min(Character.energy,addedJobs);
                 Bot.numberOfJobsClicked = addedJobs;
                 Bot.bestEquip = new Array();
                 Bot.equipBestSet(a.id);
                 var actualItemToChange = 0;
                 var tryingToEquip = false;
                  while(true) {
                      if(Bot.bestEquip.length == actualItemToChange) {
                          break;
                         }
                      if(!tryingToEquip) {
                     Bot.equip(Bot.bestEquip[actualItemToChange]);
                          tryingToEquip = true;
                  }
                     await new Promise(r => setTimeout(r, (50)));
                      if(Bot.checkIfChangeComplet(Bot.bestEquip[actualItemToChange])) {
                          actualItemToChange++;
                          tryingToEquip = false;
                         }
                 }

             for(var i = 0; i < addedJobs;i++) {
                 JobWindow.startJob(a.id,a.x,a.y,15);
             }

                 await new Promise(r => setTimeout(r, (1500)));
                 if(Bot.jobSet != -1) {
                     Bot.equipSet(Bot.jobSet);
                    }
              //await new Promise(r => setTimeout(r, ((addedJobs*15)+addedJobs+2)*1000));
                 while(true) {
                     if(TaskQueue.queue.length == 0) {
                         break;
                        }
                     if(((Character.health/Character.maxHealth)*100 <= 10) && Bot.isJobSetEquiped()) {
                          if(TaskQueue.queue.length > 0) {
                             TaskQueue.cancelAll();
                          }
                         return 1;
                     }
                     await new Promise(r => setTimeout(r,50));
                       }

           }
       
                 return 1;

        }

      Bot.setTravelSet = function(i) {
          Bot.travelSet = parseInt(i);
      }
      Bot.setJobSet = function(i) {
          Bot.jobSet = parseInt(i);
      }
      Bot.setHealthSet = function(i) {
          Bot.healthSet = parseInt(i);
      }
      Bot.equip = function(itemId) {
          if(Bag.getItemByItemId(itemId) != undefined) {
          Wear.carry(Bag.getItemByItemId(itemId));
      }
      }
      Bot.equipBestSet = function(jobId) {
          var model = jobId;
          if(jobId <= 80) {
              model -=1;
             }else if(jobId > 81 && jobId <89 ) {
                 model -=2;
             }else if(jobId >88) {
                 model -=3;
             }
          var b = west.item.Calculator.getBestSet(JobsModel.Jobs[model].get('skills'), jobId);
          for(var i = 0 ; i < b.sets.length;i++) {
              for(var j = 0; j < b.sets[i].items.length;j++) {
                  Bot.bestEquip.push(b.sets[i].items[j]);
                  //Bot.equip(b.sets[i].items[j]);

              }
          }
      }
      Bot.isEquiped = function(itemId) {
          for(var i = 0 ; i < Bot.bestSet.length;i++) {
              if(Bot.bestSet[i] == itemId) {
                  return true;
                 }
          }
          return false;
      }
      Bot.checkIfRightSet = function() {
          if(Bot.travelSet >= Bot.sets.length) {
              Bot.travelSet = -1;
          }
          if(Bot.jobSet >= Bot.sets.length) {
              Bot.jobSet = -1;
          }
          if(Bot.healthSet >= Bot.sets.lenght) {
              Bot.healthSet = -1;
          }
      }
      Bot.checkIfChangeComplet = function(itemId) {
          if(Bag.getItemByItemId(itemId) == undefined) {
                 return true;
          }else {
          var a = Bag.getItemByItemId(itemId);
          switch(a.obj.type) {
              case "yield":
                  if(a== undefined || Wear.wear.yield == undefined || Wear.wear.yield.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
              case "animal":
                  if(a== undefined || Wear.wear.animal == undefined || Wear.wear.animal.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
              case "belt":
                  if(a== undefined ||Wear.wear.belt == undefined || Wear.wear.belt.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
              case "body":
                  if(a== undefined ||Wear.wear.body == undefined || Wear.wear.body.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
              case "foot":
                  if(a== undefined ||Wear.wear.foot == undefined || Wear.wear.foot.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
              case "head":
                  if(a== undefined ||Wear.wear.head == undefined || Wear.wear.head.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
              case "left_arm":
                  if(a== undefined ||Wear.wear.left_arm == undefined || Wear.wear.left_arm.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
              case "neck":
                  if(a== undefined||Wear.wear.neck == undefined || Wear.wear.neck.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
              case "pants":
                  if(a== undefined ||Wear.wear.pants == undefined || Wear.wear.pants.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
              case "right_arm":
                  if(a== undefined ||Wear.wear.right_arm == undefined || Wear.wear.right_arm.obj.item_id != itemId) {
                      return false;
                     }else {
                         return true;
                     }
                  break;
          }
          }
          
          

      }
      Bot.isJobSetEquiped = function() {
          if(Bot.jobSet == -1) {
              return true;
          }
          var a = Bot.sets[Bot.jobSet];
          if(a.animal != undefined && ( Wear.wear.animal == undefined || a.animal != Wear.wear.animal.obj.item_id) ) {
              return false;
          }
          if(a.belt != undefined && ( Wear.wear.belt == undefined || a.belt != Wear.wear.belt.obj.item_id) ) {
              return false;
          }
          if(a.body != undefined && ( Wear.wear.body == undefined || a.body != Wear.wear.body.obj.item_id) ) {
              return false;
          }
          if(a.foot != undefined && ( Wear.wear.foot == undefined || a.foot != Wear.wear.foot.obj.item_id) ) {
              return false;
          }
          if(a.head != undefined && ( Wear.wear.head == undefined || a.head != Wear.wear.head.obj.item_id) ) {
              return false;
          }
          if(a.left_arm != undefined && ( Wear.wear.left_arm == undefined || a.left_arm != Wear.wear.left_arm.obj.item_id) ) {
              return false;
          }
          if(a.neck != undefined && ( Wear.wear.neck == undefined || a.neck != Wear.wear.neck.obj.item_id) ) {
              return false;
          }
          if(a.pants != undefined && ( Wear.wear.pants == undefined || a.pants != Wear.wear.pants.obj.item_id) ) {
              return false;
          }
          if(a.right_arm != undefined && ( Wear.wear.right_arm == undefined || a.right_arm != Wear.wear.right_arm.obj.item_id) ) {
              return false;
          }
          if(a.yield != undefined && ( Wear.wear.yield == undefined || a.yield != Wear.wear.yield.obj.item_id) ) {
              return false;
          }
          return true;

      }
      Bot.equipSet = function(setId) {
          EquipManager.switchEquip(Bot.sets[setId].equip_manager_id);
      }
      Bot.getItemBonuses = function(item) {
          //0 - hp
          //1 - motivation
          //2 - energy
          var vynuluj = false;
          var b = Array(3).fill(0);
          for(var i = 0 ; i < item.obj.usebonus.length;i++) {
              var t = item.obj.usebonus[i];
              var s = t.split(" ");
              var number = parseInt(s[s.length-1].slice(0,-1));
              if(Bot.lang == 'en_EN') {
              if(s[0] == "Energy") {
                  b[2] = number;
               }else if(s[0] == "Work") {
                   b[1] = number;
               }else if(s[0] == "Health") {
                   b[0] = number;
               }
              if(s[0]== "Duration:" || s[0] == 'Uses:') {
                 vynuluj = true;
               }
          }else if(Bot.lang = 'sk_SK') {
              if(s[3] == 'zdravia:') {
                  b[0] = number;
              }else if(s[1] == 'energie:') {
                  b[2] = number;
              }else if(s[1] == 'pracovnej') {
                  b[1] = number;
              }
              if(s[0] == 'Použitia:' || s[0] == 'Trvanie:') {
                  vynuluj = true;
              }

          }else if(Bot.lang == 'cs_CZ') {
              if(s[1] == 'zdraví:') {
                  b[0] = number;
              }else if(s[1] == 'energie:') {
                  b[2] = number;
              }else if(s[1] == 'pracovní') {
                  b[1] = number;
              }
              if(s[1] == 'použití:' || s[0] == 'Doba:') {
                  vynuluj = true;
              }
          }
          }
           if(vynuluj) {
               b[0] = 0;
               b[1] = 0;
               b[2] = 0;
           }
          return b;

      }
      Bot.getHpConsumes = function() {
          return Bag.search(Bot.languages[Bot.lang].hpSearch);
      }
      Bot.getEnergyConsumes = function() {
           return Bag.search(Bot.languages[Bot.lang].energySearch);
      }
       Bot.getMotivationConsumes = function() {
           return Bag.search(Bot.languages[Bot.lang].motivationSearch);
      }
      Bot.getBetterConsume = function(item1,item2,type) {
           var missingEnergy = Character.maxEnergy - Character.energy;
         var missingMotivation = 0;
          var missingHp = Character.maxHealth -Character.health;
          var hpPercentMissing = 100-( Character.health/Character.maxHealth)*100;
          var energyPercentMissing = 100-(Character.energy/Character.maxEnergy)*100;
         for(var i = 0 ; i > Bot.pridane.length;i++) {
             if(Bot.pridane[i].motivation == Bot.pridane[i].stopMotivation) {
                 missingMotivation++;
              }
         }
          var arr1 = Bot.getItemBonuses(item1);
          var arr2 = Bot.getItemBonuses(item2);
         

        var energy1 = arr1[2];
        var motivation1 = arr1[2];
        var hp1 = arr1[0];
        var energy2 = arr2[2];
        var motivation2 = arr2[2];
        var hp2 = arr2[0];
          var itemEnergy = Bot.getBetterEnergyItem(energy1,energy2);
          var itemMotivation = Bot.getBetterMotivationItem(motivation1,motivation2,missingMotivation);
          var itemHp = Bot.getBetterHpItem(hp1,hp2);
          if(type == 0) {
              if(itemEnergy == 0 && itemMotivation == 0) {
                  return itemHp;
              }
              if(energy1 != 0 && energy2 ==0) {
                  if(energy1 <= ((Character.maxEnergy-Character.energy)/Character.maxEnergy)*100) {
                      return 1;
                  }else {
                      return 2;
                  }
              }
              if(energy2 != 0 && energy1 == 0) {
                  if(energy2 <= ((Character.maxEnergy-Character.energy)/Character.maxEnergy)*100) {
                      return 2;
                  }else {
                      return 1;
                  }
              }
              if(energy1 != 0 && energy2 != 0) {
                  return itemEnergy;

              }
              if(energy1 == 0 && energy2 == 0) {
                  return itemHp;
              }
          }
          if(type == 1) {
              if((motivation1 == 0 && motivation2 !=0 ) || (motivation1 != 0 && motivation2 ==0)) {
                  return itemMotivation;
              }
              if(motivation1 != 0 && motivation2 != 0) {
                  if(energy1 == 0 && energy2 == 0) {
                      if(motivation1 >= motivation2) {
                          return 2;
                      }else {
                          return 1;
                      }
                  }else if(energy1 != 0 && energy2 == 0) {
                      if(energy1 <= ((Character.maxEnergy-Character.energy)/Character.maxEnergy)*100) {
                          return 1;
                      }else {
                          return 2;
                      }
                  }else if(energy1 != 0 && energy2 != 0) {
                      return itemEnergy;
                  }
              }
          }
        if(type == 2) {
            return itemEnergy;
        }
      }

      Bot.getBetterEnergyItem = function(energy1,energy2) {
           var energyPercentMissing = ((Character.maxEnergy-Character.energy)/Character.maxEnergy)*100;
          if(energy1 == 0 && energy2 == 0) {
              return 0;
             }
           if(energy1 <= energyPercentMissing && energy2 <= energyPercentMissing ) {
               if(energy1 >= energy2) {
                   return 1
                  }else {
                   return 2;
                  }
            }else if(energy1 > energyPercentMissing && energy2 > energyPercentMissing) {
                 return 0;
            }else if(energy1 > energyPercentMissing && energy2 < energyPercentMissing) {
                return 2;
            }else if(energy1 < energyPercentMissing && energy2 > energyPercentMissing) {
                return 1;
            }else {
                if(energy1 == energyPercentMissing) {
                    return 1
                }
                if(energy2 == energyPercentMissing) {
                    return 2;
                }
            }

      }
      Bot.getBetterMotivationItem = function(motivation1,motivation2,jobsMissing) {
          if(motivation1 == 0 && motivation2 == 0) {
              return 0;
          }
          if(motivation1 == 0 && motivation2 != 0) {
              if(Bot.pridane.lenght == jobsMissing) {
                  return 2;
                 }else {
                     return 1;
                 }

          }
          if(motivation1 != 0 && motivation2 == 0) {
              if(Bot.pridane.lenght == jobsMissing) {
                  return 1;
                 }else {
                     return 2;
                 }

          }
          if(motivation1 != 0 && motivation2 != 0) {
              return 0;
          }

      }
      Bot.getBetterHpItem = function(hp1,hp2) {
          var hpPercentMissing = ( Character.health/Character.maxHeath)*100;
          if(hp1 == 0 && hp2 == 0) {
              return 0;
          }
          if(hp1 <= hpPercentMissing && hp2 <= hpPercentMissing) {
              if(hp1 >= hp2) {
                  return 1;
                 }else {
                     return 2;
                 }
          }else if(hp1 > hpPercentMissing && hp2 <= hpPercentMissing) {
              return 2;
          }else if(hp2 > hpPercentMissing && hp1 <= hpPercentMissing) {
              return 1;
          }else if(hp1 > hpPercentMissing && hp2 > hpPercentMissing) {
              return 0;
          }else {
              if(hp1 == hpPercentMissing) {
                  return 1;
                 }
              if(hp2 == hpPercentMissing) {
                  return 2;
                 }
          }
      }

     Bot.addHp = function() {
          var hpConsumes = Bot.getHpConsumes();
          if(hpConsumes.length == 0) {
              return null;
          }
         if(hpConsumes.lenght == 1) {
             return hpConsumes[0];
         }

         var bestIndex = 0;

         for(var i = 0 ; i < hpConsumes.length;i++) {
             var tt = Bot.getBetterConsume(hpConsumes[bestIndex],hpConsumes[i],0);
             if(tt == 2) {
                 bestIndex = i;
                }
         }
         return hpConsumes[bestIndex].obj.item_id;
     }
     Bot.addEnergy = function() {
         var consumes = Bot.getEnergyConsumes();
         if(consumes.length == 0) {
             return null;
         }
         if(consumes.lenght == 1) {
             return consumes[0];
         }
         var bestIndex = 0;

         for(var i = 1; i < consumes.length;i++) {
             var tt = Bot.getBetterConsume(consumes[bestIndex],consumes[i],2);
             if(tt == 2) {
                 bestIndex = i;
             }
         }
         return consumes[bestIndex].obj.item_id;
         

     }
     Bot.addMotivation = function() {
         var consumes = Bot.getMotivationConsumes();
         if(consumes.length == 0) {
             return null;
         }
         if(consumes.lenght == 1) {
             return consumes[0];
         }
         var bestIndex = 0;

         for(var i = 1; i < consumes.length;i++) {
             var tt = Bot.getBetterConsume(consumes[bestIndex],consumes[i],1);
             if(tt == 2) {
                 bestIndex = i;
             }
         }

          return consumes[bestIndex].obj.item_id
     }
     Bot.createOpeningDialog = function() {
         var title = 'Kvôli Kimonovi';
         var energyYesNo = Bot.allowEnergy ? 'áno': 'nie';
         var motivationYesNo = Bot.allowMotivation ? 'áno': 'nie';
         var hpYesNo = Bot.allowHp ? 'áno': 'nie';
         var speedSet = 'nezadaný';
         if(Bot.travelSet != -1) {
             speedSet = Bot.sets[Bot.travelSet].name
         }
         var jobSet = 'nezadaný';
         if(Bot.jobSet != -1) {
             jobSet = Bot.sets[Bot.jobSet].name;
         }
         var hpSet = 'nezadaný';
         if(Bot.healthSet != -1) {
             hpSet = Bot.sets[Bot.healthSet].name
         }
         var message = "<div style='text-align:left'>" +  'Doplň energiu: ' + energyYesNo+ "<br /><div style='text-align:left'>" +  'Doplň  motiváciu: ' + motivationYesNo+ "<br /><div style='text-align:left'>" +  'Doplň hp: ' + hpYesNo+ "<br /><div style='text-align:left'>" +  'Set na cestovanie: ' + speedSet+ "<br /><div style='text-align:left'>" +  'Set na práce: ' + jobSet+ "<br /><div style='text-align:left'>" +  'Set na hp: ' + hpSet+ "<br />";
         var dialog = new west.gui.Dialog(title,message,west.gui.Dialog.SYS_QUESTION).addButton("yes",function() {
             ;
             if(!Bot.madeSequence) {
                 Bot.madeSequence = true;
                 Bot.createRoute();
             }
             Bot.setCookies();
             Bot.stopBot = true
             Bot.run();

         }).addButton("no",function(){});
         dialog.show();
     }


      Bot.setCookies = function() {
          var expiracyDate = new Date();
          var hour = expiracyDate.getHours();
          expiracyDate.setHours(2,0,0);
          if(hour > 2) {
              expiracyDate.setDate(expiracyDate.getDate() + 1);
          }
          var objekt = {};
          objekt.pridane = Bot.pridane.length;
          objekt.pridaneArr = new Array();
          for(var i = 0 ; i < Bot.pridane.length;i++) {
              objekt.pridaneArr.push(Bot.pridane[i]);
          }
          objekt.point = Bot.startPoint;
          objekt.travelSet = Bot.travelSet;
          objekt.jobSet = Bot.jobSet;
          objekt.healthSet = Bot.healthSet;
          objekt.allowHp = Bot.allowHp;
          objekt.allowMotivation = Bot.allowMotivation;
          objekt.allowEnergy = Bot.allowEnergy;
          objekt.direction = Bot.direction;
          objekt.sequence = Bot.madeSequence;

          var cookieString = "expires=" + expiracyDate.toUTCString() + ";path=/";
         // document.cookie = cookieString;
          var jsonString = JSON.stringify(objekt);
          document.cookie = "objekt=" + jsonString + ";expires=" + expiracyDate.toGMTString() + ";";

      }
      Bot.getCookies = function() {
          var x = document.cookie.split("=");
          var setCookie = false;
          var arrayIndex = -1;
          for(var j = 0 ; j < x.length;j++) {
              if(x[j].includes("objekt")) {
                  setCookie = true;
                  arrayIndex = j+1;
                  break;
              }
          }
          if(setCookie) {
              var s = x[arrayIndex].split(";");
          var objekt = JSON.parse(s[0]);


          Bot.startPoint = objekt.point;
          Bot.travelSet = objekt.travelSet;
          Bot.healthSet = objekt.healthSet;
          Bot.jobSet = objekt.jobSet;
          Bot.allowHp = objekt.allowHp;
          Bot.allowMotivation = objekt.allowMotivation;
          Bot.allowEnergy = objekt.allowEnergy;
          Bot.direction = objekt.direction;
          Bot.madeSequence = objekt.sequence;
          for(var i = 0 ; i < objekt.pridaneArr.length;i++) {
              Bot.pridane.push(objekt.pridaneArr[i]);
          }

      }



      }
    
      Bot.addColumnCss = function() {
           $('.bot .jobIcon').css('width', '60px');
           $('.bot .jobName').css('width', '140px');
          $('.bot .jobXp').css('width', '50px');
           $('.bot .jobXp2').css('width', '30px');
          $('.bot .jobMoney').css('width', '50px');
          $('.bot .jobMoney2').css('width', '30px');
          $('.bot .jobLuck').css('width', '75px');
          $('.bot .jobLuck2').css('width', '60px');
          $('.bot .jobMotivation').css('width', '50px');
          $('.bot .jobMotivation2').css('width', '30px');;
          $('.bot .jobDistance').css('width', '75px');
           $('.bot .jobDistance2').css('width', '65px');
          $('.bot .jobStopMotivation').css('width', '40px');
          $('.bot .subMotivation').css('width', '50px');
           $('.bot .addMotivation').css('width', '50px');
           $('.bot .addJob').css('width', '100px');
           $('.bot .row').css('height', '56px');
          // $('.bot .row').css('background', 'none');
          $('.bot .row_head .jobName').css('width', '135px');
          $('.bot .row_head .jobXp').css('width', '50px');
          $('.bot .row_head .jobMoney').css('width', '50px');
          $('.bot').find('.tw2gui_scrollpane').css('height', '250px');
      }
      Bot.addConsumeTableCss = function() {
          $('.bot .row').css('height', '90px');
           $('.bot .itemIcon').css('width', '100px');
           $('.bot .itemName').css('width', '150px');
           $('.bot .itemEnergy').css('width', '60px');
           $('.bot .itemMotivation').css('width', '60px');
           $('.bot .itemHealth').css('width', '60px');
           $('.bot .itemCount').css('width', '60px');
          $('.bot .row').css('background', 'none');

      }
      Bot.calcDistance = function(jx,jy) {
          var to ={
              x: jx,
              y: jy
          };
          return Map.calcWayTime(Character.position,to).formatDuration();
      }
      Bot.addAddButton = function(x,y,id,time,silver,xp,money,minLuck,maxLuck,motivation) {
          var b = Bot.makeButton('Pridaj', function () {
              Bot.madeSequence = false;
          Bot.pridane.push(new JobData(x,y,id,time,silver,xp,money,motivation,minLuck,maxLuck,75));
              Bot.refreshWindow();
         });
         b.setWidth(100);
         return b.getMainDiv();
      }
      Bot.makeButton = function (caption, callback) {
      return new west.gui.Button(caption, callback);
    };
    Bot.addRemoveButton = function(x,y,id,time,silver,xp,money,minLuck,maxLuck,motivation) {
          var b = Bot.makeButton('Odober', function () {
              var p = new JobData(x,y,id,time,silver,xp,money,motivation,minLuck,maxLuck)
           var index;
              var a = Bot.pridane;
              for(var c = 0; c < a.length;c++) {
                  if(a[c].id == id) {
                      index = c;
                      break;
                     }
              }
              if(Bot.startPoint >= index && Bot.startPoint > 0) {
                  Bot.startPoint--;
                 }
              Bot.pridane.splice(index,1);
              if(Bot.pridane.length == 0) {
                  Bot.madeSequence = false;
              }
              Bot.madeSequence = false;
              Bot.refreshTab2();
         });
         b.setWidth(100);
         return b.getMainDiv();
      }
    Bot.plusMotivationButton = function(i) {
        var b = Bot.makeButton('+',function() {
            if(Bot.pridane[i].stopMotivation < 100) {
             Bot.pridane[i].stopMotivation++;
            Bot.refreshTab2();
        }
        });
        b.setWidth(50);
        return b.getMainDiv();
    }
    Bot.minusMotivationButton = function(i) {
         var b = Bot.makeButton('-',function() {
             if(Bot.pridane[i].stopMotivation > 0) {
             Bot.pridane[i].stopMotivation--;
             Bot.refreshTab2();
         }
        });
        b.setWidth(50);
        return b.getMainDiv();
    }
    Bot.addStopButton = function() {
        var b = Bot.makeButton('vypni',function()
        {
            if(TaskQueue.queue.length > 0) {
                var length = TaskQueue.queue.length;
                Bot.pridane[Bot.startPoint].motivation += Bot.numberOfJobsClicked-length;

            TaskQueue.cancelAll();
        }
            Bot.stopBot = false;
            Bot.refreshTab2();
        });
        b.setWidth(100);
        return b.getMainDiv();
    }

    Bot.isAdded = function(id,x,y) {
        for(var j in Bot.pridane) {
            var job = Bot.pridane[j];
            if(job.x == x && job.y == y&& job.id == id) {
                return true;
               }
        }
        return false;
    }
    Bot.buildFooterSelectedJobs = function() {
            var footer = $('<div class="bot_table_foot" style="margin-top: 1px"><span id="bot_job_search" style="position: relative;"/><span id="bot_share" style="position: absolute; left:100%;"/><span id="bot_hpAdd" style="position: absolute; left:300%;"/><span id="bot_energyAdd" style="position: absolute; left:120%;"/><span id="bot_motivationAdd" style="position: absolute; left:120%;"/></div>');
             var exportButton = Bot.makeButton('Zapni bota', function () {
                 Bot.createOpeningDialog();
      }).setWidth(100);
        var hpCheckBox = new west.gui.Checkbox();
        hpCheckBox.setLabel('Doplň hp');
        hpCheckBox.setCallback(function() {
            if(this.isSelected()) {
                Bot.allowHp = true;
              }else {
                  Bot.allowHp = false;
              }
        });

         var energyCheckBox = new west.gui.Checkbox();
        energyCheckBox.setLabel('Doplň energiu');
        energyCheckBox.setCallback(function() {
            if(this.isSelected()) {
                Bot.allowEnergy = true;
              }else {
                  Bot.allowEnergy = false;
              }
        });

         var motivationCheckBox = new west.gui.Checkbox();
        motivationCheckBox.setLabel('Doplň motiváciu');
        motivationCheckBox.setCallback(function() {
            if(this.isSelected()) {
                Bot.allowMotivation = true;
              }else {
                  Bot.allowMotivation = false;
              }
        });

        hpCheckBox.setSelected(Bot.allowHp);
        energyCheckBox.setSelected(Bot.allowEnergy);
        motivationCheckBox.setSelected(Bot.allowMotivation);


        $('#bot_job_search', footer).append(exportButton.getMainDiv());
        $('#bot_share', footer).append(Bot.addStopButton());
        $('#bot_hpAdd', footer).append(hpCheckBox.getMainDiv());
        $('#bot_energyAdd', footer).append(energyCheckBox.getMainDiv());
        $('#bot_motivationAdd', footer).append(motivationCheckBox.getMainDiv());
        return footer;
    }

     Bot.spravTabulku = function(sortByExp,sortByMoney,sortByMotivation,sortByDistance) {
         var table = new west.gui.Table();
         var data = this.getClosestJobs(sortByExp,sortByMoney,sortByMotivation,sortByDistance);
         var xpIcon = '<img src="/images/icons/star.png">';
         var dollarIcon = '<img src="/images/icons/dollar.png">';
         var luckIcon = '<img src="/images/icons/luck.png">';
         var motivationIcon = '<img src="/images/icons/motivation.png">';
         var dangerIcon = '<img src="/images/icons/attention.png">';
         var arrow_desc = '&nbsp;<img src="../images/window/jobs/sortarrow_desc.png"/>';
         var arrow_asc = '&nbsp;<img src="../images/window/jobs/sortarrow_asc.png"/>';
         table.addColumn('jobIcon','jobIcon').addColumn('jobName','jobName').addColumn('jobXp','jobXp').addColumn('jobMoney','jobMoney').addColumn('jobLuck','jobLuck').addColumn('jobMotivation','jobMotivation').addColumn('jobDistance','jobDistance').addColumn('addJob','addJob').appendToCell('head', 'jobIcon', 'Praca').appendToCell('head', 'jobName', 'Nazov').appendToCell('head', 'jobXp', xpIcon + (sortByExp == 1 ? arrow_asc : sortByExp ==  - 1 ? arrow_desc : '')).appendToCell('head','jobMoney',dollarIcon + (sortByMoney == 1 ? arrow_asc : sortByMoney ==  - 1 ? arrow_desc : '')).appendToCell('head','jobLuck',luckIcon).appendToCell('head','jobMotivation',motivationIcon+ (sortByMotivation == 1 ? arrow_asc : sortByMotivation ==  - 1 ? arrow_desc : '')).appendToCell('head','jobDistance','Vzdialenost' +(sortByDistance == 1 ? arrow_asc : sortByDistance ==  - 1 ? arrow_desc : '')).appendToCell('head','addJob','');
         var i;
         for(i = 0; i < data.length;i++) {
             if(data[i] != null) {
             var c = Bot.isAdded(data[i].id,data[i].x,data[i].y);
         }
             if(data[i] == null || Bot.isAdded(data[i].id,data[i].x,data[i].y) ) {
                 continue;
                }
             table.appendRow().appendToCell(-1,'jobIcon',Bot.getJobIcon(data[i].x,data[i].y,Bot.getJobIconName(data[i].id),data[i].silver)).appendToCell(-1,'jobName',Bot.getJobName(data[i].id)).appendToCell(-1,'jobXp',data[i].xp).appendToCell(-1,'jobMoney',data[i].money).appendToCell(-1,'jobLuck',data[i].luckMin + '-'+ data[i].luckMax).appendToCell(-1,'jobMotivation',data[i].motivation).appendToCell(-1,'jobDistance',data[i].time).appendToCell(-1,'addJob',Bot.addAddButton(data[i].x,data[i].y,data[i].id,data[i].time,data[i].silver,data[i].xp,data[i].money,data[i].luckMin,data[i].luckMax,data[i].motivation));
         }
         return table;
     }

     Bot.makeAddedJobsTable = function() {
         var table = new west.gui.Table();
          var xpIcon = '<img src="/images/icons/star.png">';
         var dollarIcon = '<img src="/images/icons/dollar.png">';
         var luckIcon = '<img src="/images/icons/luck.png">';
         var motivationIcon = '<img src="/images/icons/motivation.png">';
         var footer = this.buildFooterSelectedJobs();
         table.addColumn('jobIcon','JobIcon').addColumn('jobName','jobName').addColumn('jobXp2','jobXp2').addColumn('jobMoney2','jobMoney2').addColumn('jobLuck2','jobLuck2').addColumn('jobMotivation2','jobMotivation2').addColumn('jobDistance2','jobDistance2').addColumn('jobStopMotivation','jobStopMotivation').addColumn('subMotivation','subMotivation').addColumn('addMotivation','addMotivation').addColumn('removeJob','removeJob').appendToCell('head','jobIcon','Praca').appendToCell('head','jobName','Nazov').appendToCell('head','jobXp2',xpIcon).appendToCell('head','jobMoney2',dollarIcon).appendToCell('head','jobLuck2',luckIcon).appendToCell('head','jobMotivation2',motivationIcon).appendToCell('head','jobDistance2','Dlzka').appendToCell('head','jobStopMotivation','Min motivacia').appendToCell('head','subMotivation','').appendToCell('head','addMotivation','').appendToCell('head','removeJob','');
         var data = Bot.pridane;
         for(var i = 0; i < data.length;i++) {
             table.appendRow().appendToCell(-1,'jobIcon',Bot.getJobIcon(data[i].x,data[i].y,Bot.getJobIconName(data[i].id),data[i].silver)).appendToCell(-1,'jobName',Bot.getJobName(data[i].id)).appendToCell(-1,'jobXp2',data[i].xp).appendToCell(-1,'jobMoney2',data[i].money).appendToCell(-1,'jobLuck2',data[i].luckMin + '-'+ data[i].luckMax).appendToCell(-1,'jobMotivation2',data[i].motivation).appendToCell(-1,'jobDistance2',data[i].time).appendToCell(-1,'jobStopMotivation',data[i].stopMotivation).appendToCell(-1,'subMotivation',Bot.minusMotivationButton(i)).appendToCell(-1,'addMotivation',Bot.plusMotivationButton(i)).appendToCell(-1,'addJob',Bot.addRemoveButton(data[i].x,data[i].y,data[i].id,data[i].time,data[i].silver,data[i].xp,data[i].money,data[i].luckMin,data[i].luckMax,data[i].motivation));
         }
         table.appendToFooter('jobIcon',footer);
         return table;
     }
     Bot.makeConsumableTable = function() {
         var table = new west.gui.Table();
         var searchMotivation = '';
         var searchEnergy = '';
         if(Bot.lang == 'cs_CZ') {
             searchMotivation = 'pracovní motivace';
             searchEnergy = 'energie';
            }
         if(Bot.lang == 'sk_SK') {
             searchMotivation = 'pracovnej mo';
             searchEnergy = 'energie';
            }
          if(Bot.lang == 'en_DK') {
             searchMotivation = 'work motivat';
             searchEnergy = 'energy';
            }
         var motivationConsumes = Bag.search(searchMotivation);
         var energyConsums = Bag.search(searchEnergy);

         table.addColumn('itemIcon','itemIcon').addColumn('itemName','itemName').addColumn('itemEnergy','itemEnergy').addColumn('itemMotivation','itemMotivation').addColumn('itemHealth','itemHealth').addColumn('itemCount','itemCount').appendToCell('head','itemIcon','').appendToCell('head','itemName','Názov').appendToCell('head','itemEnergy','Energia').appendToCell('head','itemMotivation','Motivácia').appendToCell('head','itemHealth','Zdravie').appendToCell('head','itemCount','Počet');

         for(var i = 0; i < motivationConsumes.length;i++) {
            table.appendRow().appendToCell(-1,'itemIcon',Bot.getItemIcon(motivationConsumes[i].obj.short)).appendToCell(-1,'itemName',motivationConsumes[i].obj.name).appendToCell(-1,'itemEnergy','0').appendToCell(-1,'itemMotivation','0').appendToCell(-1,'itemHealth','0').appendToCell(-1,'itemCount',Bag.getItemCount(motivationConsumes[i].obj.item_id));
         }
         return table;

     }
    Bot.addHeaderEvent = function() {
        $('.botwindow .row_head .jobXp').click(function() {
            Bot.sortByMoney = 0;
            Bot.sortByMotivation = 0;
            Bot.sortByDistance = 0;
            if(Bot.sortByExp == 1) {
                Bot.sortByExp = -1
               }
            else if(Bot.sortByExp == -1 || Bot.sortByExp == 0) {
                Bot.sortByExp = 1
               }
             Bot.refreshWindow();
        });
         $('.botwindow .row_head .jobMoney').click(function() {
             Bot.sortByExp = 0;
               Bot.sortByMotivation = 0;
             Bot.sortByDistance = 0;
            if(Bot.sortByMoney == 1) {
                Bot.sortByMoney = -1
               }
            else if(Bot.sortByMoney == -1 || Bot.sortByMoney == 0) {
                Bot.sortByMoney = 1
               }
             Bot.refreshWindow();
        });
        $('.botwindow .row_head .jobMotivation').click(function() {
             Bot.sortByExp = 0;
            Bot.sortByMoney = 0;
            Bot.sortByDistance = 0;
            if(Bot.sortByMotivation == 1) {
                Bot.sortByMotivation = -1
               }
            else if(Bot.sortByMotivation == -1 || Bot.sortByMotivation == 0) {
                Bot.sortByMotivation = 1
               }
             Bot.refreshWindow();
        });
        $('.botwindow .row_head .jobDistance').click(function() {
            Bot.sortByExp = 0;
            Bot.sortByMoney = 0;
               Bot.sortByMotivation = 0;
            if(Bot.sortByDistance == 1) {
                Bot.sortByDistance = -1
               }
            else if(Bot.sortByDistance == -1 || Bot.sortByDistance == 0) {
                Bot.sortByDistance = 1
               }
             Bot.refreshWindow();
        });
    }
    Bot.makeSetsUi = function() {



        var cB = new west.gui.Combobox('sets_box');
        cB.addItem(Bot.comboBoxSelectedSet.toString(),Bot.sets[Bot.comboBoxSelectedSet].name);
        for(var i = 0; i < Bot.sets.length;i++) {
            if(i == Bot.comboBoxSelectedSet) {
                continue;
               }
            cB.addItem(i.toString(),Bot.sets[i].name);
        }
        cB.addListener(function(val) {Bot.comboBoxSelectedSet = val;
                                      Bot.refreshTab3();
                                     });
        //cB.select(Bot.comboBoxSelectedSet);


        var buttonSpeedSet = new west.gui.Button('Nastav set na rýchlosť',function() {
            Bot.setTravelSet(Bot.comboBoxSelectedSet);
            Bot.setCookies();
            Bot.refreshTab3();
        });

        var buttonJobSet = new west.gui.Button('Nastav set na práce',function() {
            Bot.setJobSet(Bot.comboBoxSelectedSet);
            Bot.setCookies();
            Bot.refreshTab3();
        });

        var buttonHealthSet = new west.gui.Button('Nastav set na hp',function() {
            Bot.setHealthSet(Bot.comboBoxSelectedSet);
            Bot.setCookies();
            Bot.refreshTab3();
        });
        var actualSpeedSet = 'Nezvolený';
        if(Bot.travelSet != -1) {
            actualSpeedSet = Bot.sets[Bot.travelSet].name;

           }
        var actualJobSet = 'Nezvolený';
        if(Bot.jobSet != -1) {
            actualJobSet = Bot.sets[Bot.jobSet].name;
           }
        var actualHpSet = 'Nezvolený';
        if(Bot.healthSet != -1) {
            actualHpSet = Bot.sets[Bot.healthSet].name;
           }

        var boxHtml = $('<div></div>').append(new west.gui.Groupframe().appendToContentPane('<span style="padding:5px display:inline-block font-weight:bold">Ulozene sety</span> <br>').appendToContentPane(cB.getMainDiv()).appendToContentPane('<br><br><span style="padding:5px display:inline-block font-weight:bold"> Set na pohyb: ' + actualSpeedSet +'</span><br><br>').appendToContentPane(buttonSpeedSet.getMainDiv()).appendToContentPane('<br><br><span style="padding:5px display:inline-block font-weight:bold"> Set na práce: ' + actualJobSet +'</span><br><br>').appendToContentPane(buttonJobSet.getMainDiv()).appendToContentPane('<br><br><span style="padding:5px display:inline-block font-weight:bold"> Set na hp: ' + actualHpSet +'</span><br><br>').appendToContentPane(buttonHealthSet.getMainDiv()).getMainDiv());

        var left = $('<div style="width: 250px; height: 355px; position:absolute; top: 10px; left: 0"></div>').append(new west.gui.Scrollpane().appendContent(boxHtml).getMainDiv());

        var html = $('<div class="dobby_supravy">');

        var clothHtml = $('<div></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].neck).image + '" alt=""></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].head).image + '" alt=""></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].body).image + '" alt=""></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].pants).image + '" alt=""></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].belt).image + '" alt=""></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].foot).image + '" alt=""></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].right_arm).image + '" alt=""></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].left_arm).image + '" alt=""></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].animal).image + '" alt=""></div>').append('<div style = "display: inline-block"><img class="tw_item" src="https://westcz.innogamescdn.com'+ ItemManager.get(Bot.sets[Bot.comboBoxSelectedSet].yield).image + '" alt=""></div>');


         var right = $('<div style="width: 400px; height: 355px; position:absolute; top: 10px; right: 0"></div>').append(new west.gui.Scrollpane().appendContent(clothHtml).getMainDiv());

        html.append(left);
        html.append(right);

      //  html.append('</div>');





        return html;


    }
    Bot.createStatistic = function() {
         var html = $('<div class="dobby_statistika">');
        var html1 = $('<div></div>').append('<span style="padding:5px display:inline-block font-weight:bold">Energia ' + Character.energy+'/'+ Character.maxEnergy+ ' ('+(Character.energy/Character.maxEnergy)*100+'%)</span> <br>');
        html1.append('<span style="padding:5px display:inline-block font-weight:bold" Hp >' + Character.health + '/' + Character.maxHealth + '('+ (Character.health/Character.maxHealth)*100+'%)</span><br>');
        for(var i = 0 ; i < Bot.pridane.length;i++) {
            html1.append('<span style="padding:5px display:inline-block font-weight:bold">'+ JobList.getJobById(Bot.pridane[i].id).name + ' ' +Bot.pridane[i].motivation + ' ' + Bot.pridane[i].stopMotivation + '</span><br>');
        }
        html1.append('<span style="padding:5px display:inline-block font-weight:bold"> Aktualna praca ' + Bot.startPoint + '</span><br>');
        html1.append('<span style="padding:5px display:inline-block font-weight:bold"> Smer ' + Bot.direction + '</span><br>');
        html1.append('<span style="padding:5px; display:inline-block; font-weight:bold;"> Dopln hp ' + Bot.allowHp + '</span><br>');
        html1.append('<span style="padding:5px; display:inline-block; font-weight:bold;"> Dopln energiu ' + Bot.allowEnergy + '</span><br>');
        html1.append('<span style="padding:5px; display:inline-block; font-weight:bold;"> Dopln motivaciu ' + Bot.allowMotivation + '</span><br>');
        html.append(html1);
        return html;
    }
    Bot.refreshWindow = function() {
    var newTable = this.spravTabulku(Bot.sortByExp,Bot.sortByMoney,Bot.sortByMotivation,Bot.sortByDistance);
    $('.bot .fancytable').remove();
         $('.bot .dobby_supravy').remove();
        $('.bot .dobby_statistika').remove();
    $('.botwindow').prepend(newTable.getMainDiv());
    this.addColumnCss();
    this.addHeaderEvent();
    }
    Bot.refreshTab2 = function() {
        var newTable = this.makeAddedJobsTable();
    $('.bot .fancytable').remove();
         $('.bot .dobby_supravy').remove();
        $('.bot .dobby_statistika').remove();
    $('.botwindow').prepend(newTable.getMainDiv());
    this.addColumnCss();
    }
    Bot.refreshTab3 = function() {
    $('.bot .fancytable').remove();
        $('.bot .dobby_supravy').remove();
        $('.bot .dobby_statistika').remove();
    $('.botwindow').prepend(Bot.makeSetsUi());
    }
    Bot.refreshTab4 = function() {
    $('.bot .fancytable').remove();
    $('.bot .dobby_supravy').remove();
    $('.bot .dobby_statistika').remove();
    $('.botwindow').prepend(Bot.createStatistic());
    }
    Bot.getSets = function(callback) {
        Ajax.remoteCallMode('inventory', 'show_equip', {}, function(r) {
        Bot.sets = r.data
        callback()});
    }
    Bot.loadJobs = function(callback) {
        Ajax.get('work','index',{},function(r) {
            if(r.error) {
                console.log(r.error);
                return;
            }
            JobsModel.initJobs(r.jobs);
            callback();
        });
    }
    Bot.loadCooJobs = function() {
        Bot.loadJobsC(function() {
            var c = [];
            for(var i = 1 ; i < 35;i++) {
                var ar =Bot.jsonCoordinates.job_groups[i];
                var arJobs = [];
                var tt = JobList.getJobsByGroupId(i);
                for(var t = 0; t < ar.length;t++) {
                    for(var d= 0; d <tt.length;d++) {
                        var p = new Praca(ar[t][0],ar[t][1],tt[d].id,1000000,false);
                       c.push(p);
                    }
                }
            }
            Bot.prace = c;
       });
    }
    Bot.loadSettings = function() {
         Ajax.remoteCall("settings", "settings", {}, function(resp) {
             Bot.lang = resp.lang.account.key;
         });
         }


    Bot.init = function() {
        Bot.loadJobs(function() {});
    }
    Bot.initJ = function() {
        Bot.loadCooJobs(function(){});
    }
    Bot.loadTiles = function(callback) {
         var result = [];
      var jobGroups = Bot.jsonCoordinates.job_groups,
      i,
      j;
      for (i in jobGroups) {
        for (j in jobGroups[i]) {
          var coords = jobGroups[i][j];
          var xTile = Math.floor(coords[0] / Map.tileSize);
          var yTile = Math.floor(coords[1] / Map.tileSize);
          if (!result.hasOwnProperty(xTile)) {
            result[xTile] = {};
          }
          result[xTile][yTile] = 1;
        }
      }
    var x,
    y;
    var arr = [];
    var currentBlock = 0;
    var currentBlockLength = 0;
    for (x in result) {
      for (y in result[x]) {
        if (isNaN(x) || isNaN(y)) {
          continue;
        }
        if (currentBlockLength === 0) {
          arr[currentBlock] = [
          ];
        }
        arr[currentBlock].push([parseInt(x),
            parseInt(y)]);
        if (++currentBlockLength == 300) {
          currentBlock++;
          currentBlockLength = 0;
        }
      }
    }
   var to = arr.length;
    for (var l = 0; l < to; l++) {
      Map.Data.Loader.load(arr[l], function () {
      });
    }
        callback();
    }
    Bot.loadMap = function() {
        Bot.loadTiles( function(){});
    }
    Bot.timeOut = async function() {
        await new Promise(r => setTimeout(r, 4*1000));
    }
    Bot.loadSets = function() {
        Bot.getSets(function(){});
    }

    var menuimage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAZABoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACggJ/8QAMBAAAQQBAgMGBAcBAAAAAAAABAECAwUGBxEACBIJExQVITEjM3a1NzlCUXFzsrT/xAAXAQADAQAAAAAAAAAAAAAAAAAFBgcE/8QAJhEAAgICAgEEAQUAAAAAAAAAAQIDBAUREiEGABMiMRQHFSNBgf/aAAwDAQACEQMRAD8ABeNE2KNOlN3ORrlVf1LtuiL6+yb7Jtt6cLU5AtEcSyDlVw/K4haG6mq8RxYSwJsfAl5Q5+SqO+sDhHkBlOnqVL8UAJ4J0gtbEPBEW4fZHyksVywpHIquRqNYxWpsiMVVT4jt1Tbb0avp6b8Jz7Ijn2zDTzRVukxddIMzGPN8bwPIYgxyBz4DTJr6Mc6aVGtrY6q3NiCktSZGjd2SOxrp54Ih2o3m1a1YxUZqu6vFajZgkvsllIIPz4u3+KN98uwujWP0e80PhXkdm+KOJu/l4yaqf3jHTZOtF8klDLViu0gJGdECyPKeI2q8S/NcSO0Jxeix3m51krMZoQ8cAgtaUmWnroIxQorIvGqee5mFGi2jhQyzUk6SGJGx+KJKfExrXsYkR9Lk92uRf2VFRU/lF9uEm88HZ42Ot93qDr1gOfxG6pSQgFXOBW0ckoWYOAogGjxYvYwo/wAkPjEjQCOOykloiSh+6WerVJZuDy2WL5PVWNhWWeL5EDY1ppQFgETSWDCAzQ55ByxSGIO5GTDzxyRSt6l6ZGOTddt+CuCyVe9RhSOb3Z6sMEFoMSHWZYlDH58WdWI2sgHFh/fIEBJ8qhmmzmSyTUFo18tfuZGrBBr8eKK3ZeZYIQrNwWEOI1jbTKoH2NMag1F5H+ZLTXQ5+vWaYI6o0+V+M7mvsA5jGVuVQQ+XW84bXpKPDFZTi0NlXkthuALMwaR4MlfI42O1+Q3OtO6LSasa6Ssly3HkzI6UGymjhQrJJDXS1gayLu6KQqqlj8m60Vs5TV7pFnGb0aE87P5d+Y/QuF/eMd4Pny1/NufrTTL7xZcDZppcvhbTzssTwW/iYVZQVUKoVgzsd6mOyCNlVIA7B0xVosXlaiQc2WxTR2DsNqZFDtxIUdbTXYJ0T3vv08nT6soCOWO0sLTB2YtluQWGN5EMHdFADW2OY8tKPEgKgsIfKZJKTDHCQ0ds3g4UcpKxLKvVlcbmukimFqun2UFqpU6qXLWBJIUqyv3IkR27kfMvxHo5VcjnKiqq8WcX+Hth9Lxf9AnGcs3zZf7H/wCl4meHokPdkWd0LzkHiGHS6IGxJs9No7J3rfRPqj+UWljiw8aQIQKQctJxckssW9/xqN/Z2B9n6H16/9k=';
     // var menuimage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAANAA4DASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACgYH/8QAIBAAAgIDAAIDAQAAAAAAAAAAAwQCBQEGBwgJEhMUEf/EABQBAQAAAAAAAAAAAAAAAAAAAAf/xAAdEQACAwEAAwEAAAAAAAAAAAACAwEEBRIGERMi/9oADAMBAAIRAxEAPwAq/qg2LlNB5da9X9ddVqNY2XVNh19S0bRI+ujdFwi/XyJCGfrXgfCTOf1tfEMJrxXyZYjY2Rzvsn4JuukeRvROjY1F9PlvSNwZa59tSFYnCpugL09XE4Wq+nO3mgvJyEV9irsoAZYGabopORyc0dN6xwzWvA/yW4IHXH7Dpa2+8bxt1kLbBIV8krK2NbiahXyqlfrgvAFWES8WAHKPJmJkKb5xjBGvVb8NZ488FwTWtUsrditVsrazdpARFatX9CrdyMZFKSmYmr/2YQRnNs8AKxPgQh5bL/DfT15z9mjqVElaRqUhrmJt+QytTGs7WJRJLZBLEZ6EhIZL0MFPcJlBd/T8Rt+M3rkV6OFpM2VpFK2c3bIVqpe2D+zA1OOZESiJLj6SUKWI/wD/2Q==';
   // var menuimage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAZCAIAAAD8NuoTAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC41ZYUyZQAABzlJREFUSEutll1sFFUUx++jWROzMRuNIJMBC2wExjIhLcJYAT+2ZIo4gEF2BeRjKS7imorIhIBKYRUSN+r60fiVTaOJphvf3Fe7r+0j6cu+NH1qeOhDQ/pAgsbfuWfYTHh28+/0zMee+7v/c+6dNZeP95dffurD0si+4Nl9/c7hHfk3drvHXtxydmTj0b0bxg5tP7mvPxpy39y55vWhVUd3Ocd2rjlX2HJ4cN2g+9j6VY/0rXl08Nmntq19fN/W1f9jKvPJoa2/XT2RdzJWuZQyvpNDGudzctfJZVA64DrBd5+evrp/vaYKvKyVm1I29FykceDKXc/NonTAdQJNZU7v2ejnEoIgn6jwIEBClssUfKcel6sl/mcC1YMnCz5y/vrsIKlCNyEoBokqDwIkZG62EnqdqUazxv9sUfXgyUqIPFKZ00d35TKmJyeHxIDED0tcLUcz7Yk7c+3p9kTBz0Mm5qlbTvLYxA9jpHKzpifPRWJA4oclbjbipYXZe8sLiwuzlTCATMxTt7zkMVKZa9eOCYEA6UgMI3Aa405rIr4z14IJzc+0MCw9DVXGmA+KPqmEQIB0JIYROI1xpzs7dW+5CxNaWepiWHoaqqxNZS4eH4DAeqNWWaCcKQT5yXo8Nz2JAPrnzjRwE/Wqn3eYgz5jlcnb0+tHBkgFgfVGrbJArqkUg9udqeXF2wigf+8tAjfbaYaBxxz0GatsYE9JZd7fv06s0nkbCajReLVkq9aaRzOidqseFYKcnYC2VJTPlPxcRGMRBM7v1yJSiVU6byMBNWo3a7Zq3RW0JFroduJK0bUT0JaKg2wtdGMai6DokcpcP78zcIyfM7aROZpWvXp3npLZws205qYnpNPzsvqk3wUiVxaBlSjyM7+O7SZV0TOha2wjczTdTvP+CiWzhVvqLi/OSqcHsvqk3wXCbYjAShSHWVKZ6+++LrP3M0yaqderBYDuJp1EGUuFwAeKPktMsg7BgUMSyLdEN08NkEpmH2aZNFPvNCsA3U86iTLWKsUQKPosMck6BAcOSSDfEpHKfH4hsv0kYtTp1jg0kNHpEJWiYHqyTkHxS/cF6HtSdwNx2nwzuotUtp9EjLrYbUMDGZ0OUS0uLt7uUFD80n0B+p7U3aI4LanM1TM7ANKuwhtMAqIcyXKjau1JKFuUEkpBcYwqoZGZJHC/XY5IBZB2Fd5gEhCNWJYbVVu4DWWXUkIpKJ5RJTQykwSOVObWqe2Y5DumHPkz7frEeJmNSpc9oHTVvF2JWBiXC0BI1UQACR+B9Fbe/Hn9AKkwKfRMIw6XFjqz7QYblS57QOmqFbsSsXCqUQFCqiYCSPgIpLcCSWV+eW+Yfkfj5UI1kkrp4gdUIHwxDLfAmm7VmYB1SCRkFov2L+XNT1eHSUW/o3aj0oylUrr4ARWIUAzDLbAWux0mYB0SCZnFov1rgaQyF4c3UAIg9JgGkvH8TLUUaLehifGSAvUEECK4+c5LpKIEQOgxDSTjhdlmrajdhmbbNQXqCSBEQCozWnABkr5J97LtYu0hTnWjp8nYWqtRXoCsT4LlJ8GZ7Q6pAJK+Sfey7WLtIU51o6fJ2FqbcSBA1ifBCpOAVObLKwcY2w5vS2MbBcm2FMgV6ssGwe4lntnedzIZ3jZ+Rh4rcNcRuBvnQ1Ixth3elsY2CpJtqShXqC8bBLuXeGZ738tmeduEWXmswl1P4EjF314FSmRNonZiVc7WyPrBUtAliW2lqGCMvAdl/RqTt/rx8gFSKVAiaxK1E6tcWyPrB0tBlyS21eIKqSCT9WtMYEUqUy30yUuNdw5HruasB9YwQVQyOXX0R8Td+WlKGbGvws1qtWTosxP9pJKXGu8cjkZQxANrmCAqmZx6+iPi/soipYzZV+FmtVoyRCpz88wuzcvsOYIFnyBmhImB1Qw0Xo4EixfAfJvfXlpKFV8cHXmOVJqX2XMECz5BzAoTA6sZqN2IBYsXwMoCv720lCq+SCrz7dgwtdCKaFF6lOlRucWvRXZ8u4e15mZavAP0OsQE42+9QCpqoRXRovQo06Nyi1+L7Ph2D+suL3V5B+h1iAlIZS6dDBVImdQYDXwbaKwBu78UcaZVl13X0Yf1ux8f7COVAimTGqNBaAONNWD3lyIudTuy63r6sH6XVGbHlqe1t3QMxmaMnnkE6Q91i8vy8k7OU59o2xOk0t7SMRibMXrmEaQ/1G2qIS/v5Dz1IZX5+cKwnjxE8NBHq5l+hli5mQwr8/D2vl6qhwge+mg1088QKzeTYWWSyvzx/vOTF49wT8dAPcM0xhkGVgN6dhJwXW9x/OLcK+U9fb1UOgbqGaYxzpCkaNWzk4DreoujpjKfHhr87u2hSyPr39i56r3XBs+ODAwPuMGm1f4zj+3Z/OSBYP3x/qcvDPVVh9de2bvu1pH+r0Y3ff/Olvop7/uxV28c3vDRoc3ty7v//nz/15WB/y1VZeA/g0nPNEKwlVwAAAAASUVORK5CYII=';
    var div = $('<div class="ui_menucontainer" />');
    var link = $('<div id="Menu" class="menulink" onclick=Bot.spravGui(); title="Dobby" />').css('background-image', 'url(' + menuimage + ')').css('background-position', '0px 0px').mouseenter(function () {
        $(this).css('background-position', '-25px 0px');
      }).mouseleave(function () {
        $(this).css('background-position', '0px 0px');
      });
    $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));



    $(document).ready(function () {
    try {

        Bot.initJ();
      Bot.init();
     Bot.loadSets();
        Bot.loadSettings();
        Bot.getCookies();
        Bot.checkIfRightSet

        

    } catch (e) {
      console.log(e.stack);
    }
  });

})();