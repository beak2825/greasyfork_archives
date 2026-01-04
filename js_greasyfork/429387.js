// ==UserScript==
// @name         Dobby2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dobby
// @author       Llane
// @include https://*.the-west.*/game.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429387/Dobby2.user.js
// @updateURL https://update.greasyfork.org/scripts/429387/Dobby2.meta.js
// ==/UserScript==

(function() {

    function JobPrototype(x,y,id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.silver = false;
        this.distance = 0;
        this.experience = 0;
        this.money = 0;
        this.motivation = 0;
        this.stopMotivation = 75;
    };
    JobPrototype.prototype = {
        setSilver: function(isSilver) {
            this.silver = isSilver;
        },
        calculateDistance:function() {
            this.distance = Map.calcWayTime({x:this.x,y:this.y},Character.position);
        },
        setExperience:function(xp) {
            this.experience = xp;
        },
        setMoney:function(money) {
            this.money = money;
        },
        setMotivation:function(motivation) {
            this.motivation = motivation;
        },
        setStopMotivation:function(stopMotivation) {
            this.stopMotivation = stopMotivation;
        }
    };
    function ConsumablePrototype(id,image,name) {
        this.id = id;
        this.energy = 0;
        this.motivation = 0;
        this.health = 0;
        this.selected = true;
        this.image = image;
        this.count = 0;
        this.name = name;
    };
    ConsumablePrototype.prototype = {
        setEnergy:function(energy) {
            this.energy = energy;
        },
        setMotivation:function(motivation) {
            this.motivation = motivation;
        },
        setHealth:function(health) {
            this.health = health;
        },
        setSelected:function(select) {
            this.selected = select;
        },
        setCount:function(count) {
            this.count = count;
        }
    };

     Dobby = {
         window:null,
         jobsLoaded:false,
         allJobs:[],
         allConsumables:[],
         consumableUsed:[],
         addedJobs:[],
         jobFilter:{filterOnlySilver:false,filterNoSilver:false,filterCenterJobs:false,filterJob:""},
         sortJobTableXp:0,
         sortJobTableDistance:0,
         jobTablePosition:{content:"0px",scrollbar:"0px"},
         addedJobTablePosition:{content:"0px",scrollbar:"0px"},
         currentState:0,
         states:["idle","running","waiting for a consumable cooldown"],
         sets:null,
         selectedSet:0,
         travelSet:-1,
         jobSet:-1,
         healthSet:-1,
         language:"",
         searchKeys:{
             "en_DK":{
                 energy:"Energy",
                 energyText:"Energy increase:",
                 motivation:"Work motivation",
                 motivationText:"Work motivation increase:",
                 health: "Health point bonus",
                 healthText:"Health point bonus:"
             }
         },
         consumableSelection:{energy:false,motivation:false,health:false},
         isRunning:false,
         currentJob:{job:0,direction:true},
         jobRunning:false,
         settings:{
             addEnergy:false,
             addMotivation:false,
             addHealth:false,
             healthStop:10,
             setWearDelay:5
         },

    };
    Dobby.isNumber = function(potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };

    Dobby.loadJobs = function() {
        if(!Dobby.jobsLoaded) {
        new UserMessage("Loading...", UserMessage.TYPE_HINT).show();
        var tiles = [];
        var index = 0;
        var currentLength = 0;
        var maxLength = 299;
        Ajax.get('map','get_minimap',{},function(r){
            var tiles = [];
            var jobs = [];
            for(var jobGroup in r.job_groups) {
                var group = r.job_groups[jobGroup];
                var jobsGroup = JobList.getJobsByGroupId(parseInt(jobGroup));
                for(var tilecoord = 0; tilecoord < group.length;tilecoord++) {
                    var xCoord = Math.floor(group[tilecoord][0]/Map.tileSize);
                    var yCoord = Math.floor(group[tilecoord][1]/Map.tileSize);
                    if(currentLength == 0) {
                        tiles[index] = [];
                    }
                    tiles[index].push([xCoord,yCoord]);
                    currentLength++;
                    if(currentLength == maxLength) {
                        currentLength = 0;
                        index++;
                    }
                    for(var i = 0 ; i < jobsGroup.length;i++) {
                    jobs.push(new JobPrototype(group[tilecoord][0],group[tilecoord][1],jobsGroup[i].id));
                    }
                }
            }
            var toLoad = tiles.length;
            var loaded = 0;
                for(var blocks = 0; blocks < tiles.length;blocks++) {
                    Map.Data.Loader.load(tiles[blocks],function(){
                        loaded++;
                        if(loaded == toLoad) {
                            Dobby.jobsLoaded = true;
                            Dobby.allJobs = jobs;
                            Dobby.findAllConsumables();
                            Dobby.createWindow();
                        }
                    });
                }
        });
      }else {
          Dobby.findAllConsumables();
          Dobby.createWindow();
      }
    };
    Dobby.loadJobData = function(callback) {
        Ajax.get('work','index',{},function(r) {
            if(r.error) {
                console.log(r.error);
                return;
            }
            JobsModel.initJobs(r.jobs);
            callback();
        });
    };
    Dobby.loadSets = function(callback) {
        Ajax.remoteCallMode('inventory', 'show_equip', {}, function(r) {
            Dobby.sets = r.data;
            callback();
        });
    };
    Dobby.loadLanguage = function() {
        Ajax.remoteCall("settings", "settings", {}, function(resp) {
             Dobby.language = resp.lang.account.key;
         });
    };
    Dobby.loadJobMotivation = function(index,callback) {
        Ajax.get('job','job',{jobId:Dobby.addedJobs[index].id,x:Dobby.addedJobs[index].x,y:Dobby.addedJobs[index].y},function(r){
            callback(r.motivation*100);
        });
    };
    Dobby.getJobName = function(id) {
        return JobList.getJobById(id).name;
    };
    Dobby.getJobIcon = function(silver,id,x,y) {
        var html ='<div class="centermap" onclick="Map.center(' + x + ',' + y + ');"style="position: absolute;background-image: url(\'../images/map/icons/instantwork.png\');width: 20px;height: 20px;top: 0;right: 3px;cursor: pointer;"></div>';
        var silverHtml = "";
        if(silver) {
             silverHtml = '<div class="featured silver"></div>';
         }
        return'<div class="job" style="left: 0; top: 0; position: relative;"><div  onclick="" class="featured"></div>' + silverHtml + html + '<img src="../images/jobs/' + JobList.getJobById(id).shortname + '.png" class="job_icon"></div>';
    };
    Dobby.getConsumableIcon = function(src) {
        return "<div><img src ="+ src + "></div>";
    };
    Dobby.checkIfSilver = function(x,y,id) {
        var key = x + "-" + y;
        var jobData = Map.JobHandler.Featured[key];
        if(jobData == undefined || jobData[id] == undefined) {
            return false;
        }else {
            return jobData[id].silver;
        }
    };
    Dobby.compareUniqueJobs = function(job,jobs){
        for(var i = 0 ; i < jobs.length;i++) {
            if(jobs[i].id == job.id) {
                if(job.silver && !jobs[i].silver || job.distance < jobs[i].distance) {
                    jobs.splice(i,1);
                    jobs.push(job);
                }
                return;
            }
        }
        jobs.push(job);
    };
    Dobby.findJobData = function(job) {
        for(var i = 0 ; i < JobsModel.Jobs.length;i++) {
            if(JobsModel.Jobs[i].id == job.id) {
                return JobsModel.Jobs[i];
            }
        }
    };
    Dobby.parseJobData = function(jobs) {
        for(var job = 0 ; job < jobs.length;job++) {
            var currentJob = jobs[job];
            var data = Dobby.findJobData(currentJob);
            var xp = data.basis.short.experience;
            var money = data.basis.short.money;
            currentJob.setMotivation(data.jobmotivation*100);
            if(currentJob.silver) {
                xp = Math.ceil(1.5*xp);
                money = Math.ceil(1.5*money);
            }
            currentJob.setExperience(xp);
            currentJob.setMoney(money);
        }
    };
    Dobby.getAllUniqueJobs = function() {
        var jobs = [];
        for(var i = 0 ; i < Dobby.allJobs.length;i++) {
            var currentJob = Dobby.allJobs[i];
            if(Dobby.jobFilter.filterJob != "") {
                if(!Dobby.getJobName(currentJob.id).toLowerCase().includes(Dobby.jobFilter.filterJob)) {
                    continue;
                }
            }
            if(!JobList.getJobById(currentJob.id).canDo()) {
                continue;
            }
            if(Dobby.checkIfJobAdded(currentJob.id)) {
                continue;
            }
            var isSilver = Dobby.checkIfSilver(currentJob.x,currentJob.y,currentJob.id);
            currentJob.silver = isSilver;
            currentJob.calculateDistance();
            if(isSilver && Dobby.jobFilter.filterNoSilver) {
                continue;
            }
            if(!isSilver && Dobby.jobFilter.filterOnlySilver) {
                continue;
            }
            if(Dobby.jobFilter.filterCenterJobs && currentJob.id < 131 ) {
                continue;
            }
            Dobby.compareUniqueJobs(currentJob,jobs);
        }
        Dobby.parseJobData(jobs);

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
              var a1 = a.experience;
              var b1 = b.experience;
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
              var a1 = a.experience;
              var b1 = b.experience;
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
              var a1 = a.distance;
              var b1 = b.distance;
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
              var a1 = a.distance;
              var b1 = b.distance;
              return (a1 > b1) ? 1 :(a1 < b1) ? -1 :0;
          };
        if(Dobby.sortJobTableXp == 1) {
            jobs.sort(experienceSort);
        }
        if(Dobby.sortJobTableXp == -1) {
            jobs.sort(reverseExperienceSort);
        }
        if(Dobby.sortJobTableDistance == 1) {
            jobs.sort(distanceSort);
        }
        if(Dobby.sortJobTableDistance == -1) {
            jobs.sort(reverseDistanceSort);
        }
        return jobs;
    };
    Dobby.findJob = function(x,y,id) {
        for(var i = 0 ; i < Dobby.allJobs.length;i++) {
            if(Dobby.allJobs[i].id == id && Dobby.allJobs[i].x == x && Dobby.allJobs[i].y == y) {
                return Dobby.allJobs[i];
            }
        }
    };
    Dobby.addJob = function(x,y,id) {
        if(!Dobby.checkIfJobAdded(id)) {
        Dobby.addedJobs.push(Dobby.findJob(x,y,id));
        }
    };
    Dobby.removeJob = function(x,y,id) {
        for(var i = 0; i < Dobby.addedJobs.length;i++) {
            if(Dobby.addedJobs[i].id == id && Dobby.addedJobs[i].x == x && Dobby.addedJobs[i].y == y) {
                Dobby.addedJobs.splice(i,1);
                break;
            }
        }
    };
    Dobby.checkIfJobAdded = function(id) {
        for(var i = 0; i < Dobby.addedJobs.length;i++) {
            if(Dobby.addedJobs[i].id == id ) {
                return true;
            }
        }
        return false;
    };
    Dobby.parseStopMotivation = function() {
        for(var i = 0 ; i < Dobby.addedJobs.length;i++) {
            var stopMotivation = $(".dobby2window #x-" + Dobby.addedJobs[i].x + "y-" + Dobby.addedJobs[i].y + "id-" + Dobby.addedJobs[i].id).prop("value");
            if(Dobby.isNumber(stopMotivation)) {
                Dobby.addedJobs[i].setStopMotivation(parseInt(stopMotivation));
            }else {
                return false;
            }
        }
        return true;
    };
    Dobby.getItemImage = function(id) {
      return ItemManager.get(id).wear_image;
    };
    Dobby.findAllConsumables = function() {
        var energyConsumes = Bag.search(Dobby.searchKeys[Dobby.language].energy);
        for(var i = 0 ; i < energyConsumes.length;i++) {
            Dobby.addConsumable(energyConsumes[i]);
        }
        var motivationConsumes = Bag.search(Dobby.searchKeys[Dobby.language].motivation);
        for(var i = 0; i < motivationConsumes.length;i++) {
          Dobby.addConsumable(motivationConsumes[i]);
        }
        var healthConsumes = Bag.search(Dobby.searchKeys[Dobby.language].health);
        for(var i = 0; i < healthConsumes.length;i++) {
            Dobby.addConsumable(motivationConsumes[i]);
        }
    };
    Dobby.CheckIfConsumableAdded = function(item) {
        if(item == undefined)
            return true;
        for(var i = 0 ; i < Dobby.allConsumables.length;i++) {
            if(Dobby.allConsumables[i].id == item.obj.item_id) {
                return true;
            }
        }
        return false;
    };
    Dobby.addConsumable = function(item) {
        if(Dobby.CheckIfConsumableAdded(item)) {
            return;
        }
        var consumable = new ConsumablePrototype(item.obj.item_id,item.obj.image,item.obj.name);
        var bonuses = Dobby.parseConsumableBonuses(item.obj.usebonus);
        if(bonuses[0] == 0 && bonuses[1] == 0 && bonuses[2] == 0)
        return;
        consumable.setEnergy(bonuses[0]);
        consumable.setMotivation(bonuses[1]);
        consumable.setHealth(bonuses[2]);
        consumable.setCount(item.count);
        Dobby.allConsumables.push(consumable);
    };
    Dobby.removeConsumable = function(item) {
        var index;
        for(var i = 0 ; i < Dobby.allConsumables.length;i++) {
            if(Dobby.allConsumables[i].id == item.id) {
                index = i;
                break;
            }
        }
        if(index != undefined) {
            if(Dobby.allConsumables[index].count > 1) {
                Dobby.allConsumables[index].count--;
            }else {
                Dobby.allConsumables.slice(index,1);
            }
        }
    };
    Dobby.parseConsumableBonuses = function(bonuses) {
        var getBonus = function(text,type) {
            switch(type) {
                case 0:
                    text = text.replace(Dobby.searchKeys[Dobby.language].energyText,"");
                    break;
                case 1:
                    text = text.replace(Dobby.searchKeys[Dobby.language].motivationText,"")
                    break;
                case 2:
                    text = text.replace(Dobby.searchKeys[Dobby.language].healthText,"");
                    break;
            }
            text = text.slice(1);
            text = text.replace("%","");
            return parseInt(text);
        }
        var result = Array(3).fill(0);
        for(var i = 0 ; i < bonuses.length;i++) {
            var type = -1;
            if(bonuses[i].includes(Dobby.searchKeys[Dobby.language].energyText)) {
                type = 0;
            }else if(bonuses[i].includes(Dobby.searchKeys[Dobby.language].motivationText)) {
                type = 1;
            }else if(bonuses[i].includes(Dobby.searchKeys[Dobby.language].healthText)) {
                type = 2;
            }
            if(type !=-1)
            result[type] = getBonus(bonuses[i],type);

        }
        return result;
    };
    Dobby.filterConsumables = function(energy,motivation,health) {
        var result = [];
        for(var i = 0 ; i < Dobby.allConsumables.length;i++) {
            if(energy && Dobby.allConsumables[i].energy == 0) {
                continue;
            }
            if(motivation && Dobby.allConsumables[i].motivation == 0) {
                continue;
            }
            if(health && Dobby.allConsumables[i].health == 0) {
                continue;
            }
            result.push(Dobby.allConsumables[i]);
        }
        return result;
    };
    Dobby.changeConsumableSelection = function(id,selected) {
        for(var i = 0 ; i < Dobby.allConsumables.length;i++) {
            if(Dobby.allConsumables[i].id == id) {
                Dobby.allConsumables[i].setSelected(selected);
                break;
            }
        }
    };
    Dobby.changeSelectionAllConsumables = function(selected) {
        for(var i = 0 ; i < Dobby.allConsumables.length;i++) {
            Dobby.allConsumables[i].setSelected(selected);
        }
    };
    Dobby.canUseConsume = function(item) {
        if(BuffList.cooldowns[item.id] != undefined && BuffList.cooldowns[item.id].time > new ServerDate().getTime()) {
            return false;
        }
        return true;
    };
    Dobby.useConsumable = async function(itemToUse) {
        var item = Bag.getItemByItemId(itemToUse.id);
        item.showCooldown();
        Dobby.currentState = 2;
        Dobby.selectTab("choosenJobs");
        while(true) {
            if(Dobby.canUseConsume(itemToUse)) {
                if(Dobby.healthSet != -1) {
                    Dobby.equipSet(Dobby.healthSet);
                    await new Promise(r => setTimeout(r, Dobby.settings.setWearDelay*1000));
                }
                Dobby.removeConsumable(itemToUse);
                Dobby.consumableUsed.push(itemToUse);
                ItemUse.doIt(itemToUse.id);
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        while(true) {
            if(!Dobby.canUseConsume(itemToUse)) {
                $(".tw2gui_dialog_framefix").remove();
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
       // Dobby.run();
    };
    Dobby.findProperConsumable = function(motivationMissing,energyMissing,healthMissing,averageMotivationMissing,consumables) {
        var betterEnergy = function(item1,item2) {
            var distanceItem1 = Math.abs(energyMissing - item1.energy);
            var distanceItem2 = Math.abs(energyMissing - item2.energy);
            return (distanceItem1 < distanceItem2 ) ? -1 :(distanceItem1 > distanceItem2) ? 1 : 0;
        };
        var betterMotivation = function(item1,item2) {
            var distanceItem1 = Math.abs(averageMotivationMissing - item1.motivation);
            var distanceItem2 = Math.abs(averageMotivationMissing - item2.motivation);
            return (distanceItem2 < distanceItem1) ? item2 : item1;
        };
        var findMotivationConsume = function(consumes) {
            var consumeToChoose = null;
            for(var i = 0 ; i < consumes.length;i++) {
                if(consumeToChoose == null && consumes[i].motivation != 0) {
                    consumeToChoose = consumes[i];
                    continue;
                }
                if(consumeToChoose != null && consumes[i].motivation != 0) {
                    consumeToChoose = betterMotivation(consumeToChoose,consumables[i]);
                }
            }
            return consumeToChoose;
        };
        var findHealthConsume = function(consumes) {
            for(var i = 0 ; i < consumes.length;i++) {
                if(consumes[i].health != 0) {
                    return consumes[i];
                }
            }
            return null;
        };
        if(consumables.length  == 0) return null;
        var consums = consumables;
        consums = consums.sort(betterEnergy);
        if(energyMissing == Character.maxEnergy) {
            return consums[0];
        }
        if(motivationMissing == Dobby.addedJobs.length) {
            return findMotivationConsume(consums);
        }
        if(Dobby.isHealthBelowLimit()) {
            return findHealthConsume(consums);
        }
    };
    Dobby.tryUseConsumable = function(result) {
        var healthMissing = 100 - (Character.health/Character.maxHealth) * 100;
        var energyMissing = 100 - (Character.energy/Character.maxEnergy) * 100;
        var motivationMissing = Dobby.jobsBelowMotivation(result);
        var consumables = Dobby.filterConsumables(Dobby.settings.addEnergy,Dobby.settings.addMotivation,Dobby.settings.addHealth);
        var averageMotivationMissing = Dobby.averageMissingMotivation(result);
        var selectedConsumes = [];
        for(var i = 0 ; i < consumables.length;i++) {
            if(consumables[i].selected)
                selectedConsumes.push(consumables[i]);
        }
        var itemToUse = Dobby.findProperConsumable(motivationMissing,energyMissing,healthMissing,averageMotivationMissing,selectedConsumes);
        if(itemToUse == null) return false;
        Dobby.useConsumable(itemToUse);
        return true;
    }
    Dobby.createDistanceMatrix = function() {
        var distances = new Array(Dobby.addedJobs.length);
        for(var i = 0 ; i < distances.length;i++) {
            distances[i] = new Array(Dobby.addedJobs.length);
        }
        for(var i = 0 ; i < distances.length;i++) {
            for(var j = i; j < distances[i].length;j++) {
                if(i == j) {
                    distances[i][j] = distances[j][i] = Number.MAX_SAFE_INTEGER;
                    continue;
                }
                distances[i][j] = distances[j][i] = Map.calcWayTime({x:Dobby.addedJobs[i].x,y:Dobby.addedJobs[i].y},{x:Dobby.addedJobs[j].x,y:Dobby.addedJobs[j].y});
            }
        }
        return distances;
    };
    Dobby.createRoute = function() {
        var closestJobIndex = 0;
        var closestDistance = Dobby.addedJobs[0].distance;
        var route = [];
        var distances = Dobby.createDistanceMatrix();
        var getClosestJob = function(index,route,distances) {
            var closestDistance = Number.MAX_SAFE_INTEGER;
            var closestIndex = -1;
            for(var i = 0 ; i < distances.length;i++) {
                if(index == i || route.includes(i)) {
                    continue;
                }
                if(distances[i][index] < closestDistance) {
                    closestDistance = distances[i][index];
                    closestIndex = i;
                }
            }
            return closestIndex;
        };
        for(var i = 1; i < Dobby.addedJobs.length;i++) {
            if(Dobby.addedJobs[i].distance < closestDistance) {
                closestDistance = Dobby.addedJobs[i].distance;
                closestJobIndex = i;
            }
        }
        route.push(closestJobIndex);
        while(route.length < Dobby.addedJobs.length) {
            var closestJob = getClosestJob(route[route.length-1],route,distances);
            route.push(closestJob);
        }
        var addedJobsOrder = [];
        for(var i = 0 ; i < route.length;i++) {
            addedJobsOrder.push(Dobby.addedJobs[route[i]]);
        }
        Dobby.addedJobs = addedJobsOrder;
        Dobby.selectTab("choosenJobs");
    };
    Dobby.equipSet = async function(set) {
        if(set == -1) return true;
        EquipManager.switchEquip(Bot.sets[set].equip_manager_id);
        while(true) {
            let finished = await Dobby.isGearEquiped(Dobby.getSetItemArray(Bot.sets[set]));
            if(finished) break;
            await new Promise(r => setTimeout(r, 1));
        }
        return Promise.resolve(true);
    };
    Dobby.getSetItemArray = function(set) {
        var items = [];
        if(set.head != null)
            items.push(set.head);
        if(set.neck != null)
            items.push(set.neck);
        if(set.body != null)
            items.push(set.body);
        if(set.right_arm != null)
            items.push(set.right_arm);
        if(set.left_arm != null)
            items.push(set.left_arm);
        if(set.belt != null)
            items.push(set.belt);
        if(set.foot != null)
            items.push(set.foot);
        if(set.animal != null)
            items.push(set.animal);
        if(set.yield != null)
            items.push(set.yield);
        if(set.pants != null)
            items.push(set.pants);
        return items;
    };
    Dobby.isWearing = function(itemId) {
        if(Wear.wear[ItemManager.get(itemId).type] == undefined) return false;
        return Wear.wear[ItemManager.get(itemId).type].obj.item_id == itemId;
    };
    Dobby.isGearEquiped = async function(items) {
        for(var i = 0 ; i < items.length;i++) {
            if(!Dobby.isWearing(items[i]))return false;
        }
        return true;
    }
    Dobby.getBestGear = function(jobid) {
        var modelId = function(jobid) {
            for(var i = 0 ; i < JobsModel.Jobs.length;i++) {
                if(JobsModel.Jobs[i].id == jobid)
                    return i;
            }
            return -1;
        }
         var result = west.item.Calculator.getBestSet(JobsModel.Jobs[modelId(jobid)].get('skills'), jobid);
         var bestItems = result && result.getItems();
         return bestItems;
    };
    Dobby.equipBestGear = async function(jobid) {
        var bestGear = Dobby.getBestGear(jobid);
        for(var i = 0 ; i < bestGear.length;i++) {
            if(!Dobby.isWearing(bestGear[i]))
            Wear.carry(Bag.getItemByItemId(bestGear[i]));
        }
        while(true) {
            let finished = await Dobby.isGearEquiped(bestGear);
            if(finished) break;
            await new Promise(r => setTimeout(r, 1));
        }
        return Promise.resolve(true);
    };
    Dobby.checkMotivation = function(index,result,callback) {
        var check = function(index,result) {
            Dobby.loadJobMotivation(index,function(motivation) {
            result.push(motivation);
             if(index+1 < Dobby.addedJobs.length ) {
                 check(++index,result);
             }else
             if(index+1 == Dobby.addedJobs.length) {
                 callback(result);
                 return;
             }
         });
        };
        check(0,result);
    };
    Dobby.isMotivationAbove = function(result) {
        for(var i = 0 ; i < result.length;i++) {
            if(result[i] > Dobby.addedJobs[i].stopMotivation) {
                return true;
            }
        }
        return false;
    };
    Dobby.jobsBelowMotivation = function(result) {
        var count = 0;
        for(var i = 0 ; i < result.length;i++) {
            if(result[i] <= Dobby.addedJobs[i].stopMotivation) {
                count++;
            }
        }
        return count;
    };
    Dobby.averageMissingMotivation = function(result) {
        var motivation = 0;
        for(var i = 0 ; i < result.length;i++) {
            motivation += (100-result[i]);
        }
        return motivation/result.length;
    };
    Dobby.isHealthBelowLimit = function() {
        if(Dobby.settings.healthStop <= ((Character.health/Character.maxHealth) * 100)) {
            return true;
        }
        return false;
    };
    Dobby.canAddMissing = function(result) {
        if(!Dobby.settings.addMotivation && Dobby.jobsBelowMotivation(result)) {
            alert("Can't continue because of motivation");
            return false;
        }
        if(!Dobby.settings.addEnergy && Character.energy == 0) {
            alert("Can't continue because of energy");
            return false;
        }
        if(!Dobby.settings.addhealth && Dobby.isHealthBelowLimit()) {
            alert("Can't continue because of health");
            return false;
        }
        return true;
    };
    Dobby.finishRun = function() {
        Dobby.currentState = 0;
        Dobby.isRunning = false;
        Dobby.selectTab("choosenJobs");
        alert("Finished");
    };
    Dobby.run = function() {
        Dobby.checkMotivation(0,[],function(result) {
            if(Dobby.isMotivationAbove(result) && Character.energy > 0 && !Dobby.isHealthBelowLimit()){
                Dobby.currentState = 1;
                Dobby.selectTab("choosenJobs");
                Dobby.prepareJobRun(Dobby.currentJob.job);
            }else {
                if(!Dobby.canAddMissing(result)) {
                    Dobby.finishRun();
                }else {
                    var answer = Dobby.tryUseConsumable(result);
                    if(!answer) {
                        Dobby.finishRun();
                    }
                }
            }
        });
    };
    Dobby.prepareJobRun = function(index) {
            Dobby.loadJobMotivation(index,async function(motivation) {
                if(motivation <= Dobby.addedJobs[index].stopMotivation) {
                    Dobby.changeJob();
                }else
                if(Map.calcWayTime(Character.position,{x:Dobby.addedJobs[index].x,y:Dobby.addedJobs[index].y}) == 0) {
                    var maxJobs;
                    (Premium.hasBonus('automation')) ? maxJobs = 9 : maxJobs = 4;
                    var numberOfJobs = Math.min(Math.min(motivation - Dobby.addedJobs[index].stopMotivation,Character.energy),maxJobs);
                    Dobby.runJob(index,numberOfJobs);
                }else {
                    var equiped = await Dobby.equipSet(Dobby.travelSet);
                    Dobby.walkToJob(index);
                }
            });
    };
    Dobby.walkToJob = async function(index) {
        JobWindow.startJob(Dobby.addedJobs[index].id,Dobby.addedJobs[index].x,Dobby.addedJobs[index].y,15);
        while(true) {
            if(Map.calcWayTime(Character.position,{x:Dobby.addedJobs[index].x,y:Dobby.addedJobs[index].y}) == 0) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        Dobby.cancelJobs();
        Dobby.prepareJobRun(index);
    };
    Dobby.changeJob = function() {
        (Dobby.currentJob.direction) ? Dobby.currentJob.job++ : Dobby.currentJob.job--;
        if(Dobby.currentJob.job == Dobby.addedJobs.length) {
            Dobby.currentJob.job--;
            Dobby.currentJob.direction = false;
        } else if(Dobby.currentJob.job < 0) {
            Dobby.currentJob.job++;
            Dobby.currentJob.direction = true;
        }
        Dobby.run();
    };
    Dobby.runJob = async function(jobIndex,jobCount) {
        await Dobby.equipBestGear(Dobby.addedJobs[jobIndex].id);
        for(var i = 0; i < jobCount;i++) {
            JobWindow.startJob(Dobby.addedJobs[jobIndex].id,Dobby.addedJobs[jobIndex].x,Dobby.addedJobs[jobIndex].y,15);
        }
        await new Promise(r => setTimeout(r, Dobby.settings.setWearDelay * 1000));
        Dobby.equipSet(Dobby.jobSet);
        while(true) {
            if(TaskQueue.queue.length == 0) {
                Dobby.prepareJobRun(jobIndex);
                break;
            }
            if(!Dobby.isRunning || Dobby.isHealthBelowLimit()) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        Dobby.cancelJobs();

    };
    Dobby.cancelJobs = function() {
        if(TaskQueue.queue.length > 0)
            TaskQueue.cancelAll();
    };
    Dobby.createWindow = function() {
        var window = wman.open("dobby").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("Dobby2");
        var content = $('<div class=\'dobby2window\'/>');
        var tabs = {
            "jobs":"Jobs",
            "choosenJobs":"Choosen jobs",
            "sets":"Sets",
            "consumables":"Consumables",
            "stats":"Statistics",
            "settings":"Settings"
        };
        var tabLogic = function(win,id) {
            var content = $('<div class=\'dobby2window\'/>');
            switch(id) {
                case "jobs":
                    Dobby.loadJobData(function(){
                    Dobby.removeActiveTab(this);
                    Dobby.removeWindowContent();
                    Dobby.addActiveTab("jobs",this);
                    content.append(Dobby.createJobsTab());
                    Dobby.window.appendToContentPane(content);
                    Dobby.addJobTableCss();
                    $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({"top":Dobby.jobTablePosition.content});
                    $(".dobby2window .tw2gui_scrollbar_pulley").css({"top":Dobby.jobTablePosition.scrollbar});
                    Dobby.addEventsHeader();
                    });
                    break;
                case "choosenJobs":
                    Dobby.removeActiveTab(this);
                    Dobby.removeWindowContent();
                    Dobby.addActiveTab("choosenJobs",this);
                    content.append(Dobby.createAddedJobsTab());
                    $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({"top":Dobby.addedJobTablePosition.content});
                    $(".dobby2window .tw2gui_scrollbar_pulley").css({"top":Dobby.addedJobTablePosition.scrollbar});
                    Dobby.window.appendToContentPane(content);
                    Dobby.addAddedJobsTableCss();
                    break;
                case "consumables":
                    Dobby.removeActiveTab(this);
                    Dobby.removeWindowContent();
                    Dobby.addActiveTab("consumables",this);
                    Dobby.findAllConsumables();
                    content.append(Dobby.createConsumablesTable());
                    Dobby.window.appendToContentPane(content);
                    Dobby.addConsumableTableCss();
                    break;
                case "sets":
                    Dobby.loadSets(function() {
                        Dobby.removeActiveTab(this);
                        Dobby.removeWindowContent();
                        Dobby.addActiveTab("sets",this);
                        content.append(Dobby.createSetGui())
                        Dobby.window.appendToContentPane(content);
                    });
                    break;
                case "stats":
                    Dobby.removeActiveTab(this);
                    Dobby.removeWindowContent();
                    Dobby.addActiveTab("stats",this);
                    break;
                case "settings":
                    Dobby.removeActiveTab(this);
                    Dobby.removeWindowContent();
                    Dobby.addActiveTab("settings",this);
                    content.append(Dobby.createSettingsGui());
                    Dobby.window.appendToContentPane(content);
                    break;

            }
        }

        for(var tab in tabs) {
            window.addTab(tabs[tab],tab,tabLogic);
        }
        Dobby.window = window;
        Dobby.selectTab("jobs");
    };
    Dobby.selectTab = function(key) {
        Dobby.window.tabIds[key].f(Dobby.window,key);
    };
    Dobby.removeActiveTab = function(window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };
    Dobby.addActiveTab = function(key,window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };
    Dobby.removeWindowContent = function() {
        $(".dobby2window").remove();
    };
    Dobby.addJobTableCss = function() {
        $(".dobby2window .jobIcon").css({"width":"80px"});
        $(".dobby2window .jobName").css({"width":"150px"});
        $(".dobby2window .jobXp").css({"width":"40px"});
        $(".dobby2window .jobMoney").css({"width":"40px"});
        $(".dobby2window .jobMotivation").css({"width":"40px"});
        $(".dobby2window .jobDistance").css({"width":"100px"});
        $(".dobby2window .row").css({"height":"60px"});
        $('.dobby2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    Dobby.addAddedJobsTableCss = function() {
        $(".dobby2window .jobIcon").css({"width":"80px"});
        $(".dobby2window .jobName").css({"width":"150px"});
        $(".dobby2window .jobStopMotivation").css({"width":"130px"});
        $(".dobby2window .jobRemove").css({"width":"100px"});
        $(".dobby2window .row").css({"height":"60px"});
        $('.dobby2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    Dobby.addConsumableTableCss = function() {
        $(".dobby2window .consumIcon").css({"width":"80px"});
        $(".dobby2window .consumName").css({"width":"120px"});
        $(".dobby2window .consumCount").css({"width":"70px"});
        $(".dobby2window .consumEnergy").css({"width":"70px"});
        $(".dobby2window .consumMotivation").css({"width":"70px"});
        $(".dobby2window .consumHealth").css({"width":"70px"});
        $(".dobby2window .row").css({"height":"80px"});
        $('.dobby2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    Dobby.addEventsHeader = function() {
        $(".dobby2window .jobXp").click(function() {
            if(Dobby.sortJobTableXp == 0) {
                Dobby.sortJobTableXp = 1;
            }else {
                (Dobby.sortJobTableXp == 1) ? Dobby.sortJobTableXp = -1 : Dobby.sortJobTableXp = 1;
            }
            Dobby.sortJobTableDistance = 0;
            Dobby.selectTab("jobs");
        });
        $(".dobby2window .jobDistance").click(function() {
            if(Dobby.sortJobTableDistance == 0) {
                Dobby.sortJobTableDistance = 1;
            }else {
                (Dobby.sortJobTableDistance == 1) ? Dobby.sortJobTableDistance = -1 : Dobby.sortJobTableDistance = 1;
            }
            Dobby.sortJobTableXp = 0;
            Dobby.selectTab("jobs");
        });
    };
    Dobby.createJobsTab = function() {
        var htmlSkel = $("<div id = \'jobs_overview'\></div>");
        var html = $("<div class = \'jobs_search'\ style=\'position:relative;'\><div id=\'jobFilter'\style=\'position:absolute;top:10px;left:15px'\></div><div id=\'job_only_silver'\style=\'position:absolute;top:10px;left:200px;'\></div><div id=\'job_no_silver'\style=\'position:absolute;top:10px;left:270px;'\></div><div id=\'job_center'\style=\'position:absolute;top:10px;left:350px;'\></div><div id=\'button_filter_jobs'\style=\'position:absolute;top:5px;left:450px;'\></div></div>");
        var table = new west.gui.Table();
        var xpIcon = '<img src="/images/icons/star.png">';
        var dollarIcon = '<img src="/images/icons/dollar.png">';
        var motivationIcon = '<img src="/images/icons/motivation.png">';
        var arrow_desc = '&nbsp;<img src="../images/window/jobs/sortarrow_desc.png"/>';
        var arrow_asc = '&nbsp;<img src="../images/window/jobs/sortarrow_asc.png"/>';
        var uniqueJobs = Dobby.getAllUniqueJobs();
        table.addColumn("jobIcon","jobIcon").addColumn("jobName","jobName").addColumn("jobXp","jobXp").addColumn("jobMoney","jobMoney").addColumn("jobMotivation","jobMotivation").addColumn("jobDistance","jobDistance").addColumn("jobAdd","jobAdd");
        table.appendToCell("head","jobIcon","Job icon").appendToCell("head","jobName","Job name").appendToCell("head","jobXp",xpIcon + (Dobby.sortJobTableXp == 1 ? arrow_asc : Dobby.sortJobTableXp == -1 ? arrow_desc : "")).appendToCell("head","jobMoney",dollarIcon).appendToCell("head","jobMotivation",motivationIcon).appendToCell("head","jobDistance","Distance " + (Dobby.sortJobTableDistance == 1 ? arrow_asc : Dobby.sortJobTableDistance == -1 ? arrow_desc : "")).appendToCell("head","jobAdd","");
        for(var job = 0 ; job < uniqueJobs.length;job++) {
            table.appendRow().appendToCell(-1,"jobIcon",Dobby.getJobIcon(uniqueJobs[job].silver,uniqueJobs[job].id,uniqueJobs[job].x,uniqueJobs[job].y)).appendToCell(-1,"jobName",Dobby.getJobName(uniqueJobs[job].id)).appendToCell(-1,"jobXp",uniqueJobs[job].experience).appendToCell(-1,"jobMoney",uniqueJobs[job].money).appendToCell(-1,"jobMotivation",uniqueJobs[job].motivation).appendToCell(-1,"jobDistance",uniqueJobs[job].distance.formatDuration()).appendToCell(-1,"jobAdd",Dobby.createAddJobButton(uniqueJobs[job].x,uniqueJobs[job].y,uniqueJobs[job].id));
        }
        var textfield = new west.gui.Textfield("jobsearch").setPlaceholder("Select job name");
        if(Dobby.jobFilter.filterJob != "") {
            textfield.setValue(Dobby.jobFilter.filterJob);
        }
        var checkboxOnlySilver = new west.gui.Checkbox();
        checkboxOnlySilver.setLabel("Silvers");
        checkboxOnlySilver.setSelected(Dobby.jobFilter.filterOnlySilver);
        checkboxOnlySilver.setCallback(function() {
            if(this.isSelected()) {
                Dobby.jobFilter.filterOnlySilver = true;
              }else {
                Dobby.jobFilter.filterOnlySilver = false;
              }
        });
        var checkboxNoSilver = new west.gui.Checkbox();
        checkboxNoSilver.setLabel("No silvers");
        checkboxNoSilver.setSelected(Dobby.jobFilter.filterNoSilver);
        checkboxNoSilver.setCallback(function() {
            if(this.isSelected()) {
                Dobby.jobFilter.filterNoSilver = true;
              }else {
                Dobby.jobFilter.filterNoSilver = false;
              }
        });
        var checkboxCenterJobs = new west.gui.Checkbox();
        checkboxCenterJobs.setLabel("Center jobs");
        checkboxCenterJobs.setSelected(Dobby.jobFilter.filterCenterJobs);
        checkboxCenterJobs.setCallback(function() {
            if(this.isSelected()) {
                Dobby.jobFilter.filterCenterJobs = true;
              }else {
                Dobby.jobFilter.filterCenterJobs = false;
              }
        });
        var buttonFilter = new west.gui.Button("Filter",function() {
            Dobby.jobFilter.filterJob = textfield.getValue();
            Dobby.jobTablePosition.content = "0px";
            Dobby.jobTablePosition.scrollbar = "0px";
            Dobby.selectTab("jobs");
        });
        htmlSkel.append(table.getMainDiv());
        $('#jobFilter', html).append(textfield.getMainDiv());
        $("#job_only_silver",html).append(checkboxOnlySilver.getMainDiv());
        $("#job_no_silver",html).append(checkboxNoSilver.getMainDiv());
        $("#job_center",html).append(checkboxCenterJobs.getMainDiv());
        $("#button_filter_jobs",html).append(buttonFilter.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };
    Dobby.createAddJobButton = function(x,y,id) {
        var buttonAdd = new west.gui.Button("Add new job",function() {
            Dobby.addJob(x,y,id);
            Dobby.jobTablePosition.content = $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            Dobby.jobTablePosition.scrollbar = $(".dobby2window .tw2gui_scrollbar_pulley").css("top");
            Dobby.selectTab("jobs");
        });
        buttonAdd.setWidth(100);
        return buttonAdd.getMainDiv();
    };
    Dobby.createAddedJobsTab = function() {
        var htmlSkel = $("<div id=\'added_jobs_overview'\></div>");
        var footerHtml = $("<div id=\'start_dobby2'\ style=\'position:relative;'\><span class =\'dobby_state'\ style=\' position:absolute;left:20px; top:10px; font-family: Arial, Helvetica, sans-serif; font-size: 15px;font-weight: bold;'\> Current state:"+ Dobby.states[Dobby.currentState] +"</span><div class = \'dobby_run'\ style = \'position:absolute; left:350px; top:20px;'\></div></div>");
        var table = new west.gui.Table();
        table.addColumn("jobIcon","jobIcon").addColumn("jobName","jobName").addColumn("jobStopMotivation","jobStopMotivation").addColumn("jobRemove","jobRemove");
        table.appendToCell("head","jobIcon","Job icon").appendToCell("head","jobName","Job name").appendToCell("head","jobStopMotivation","Stop motivation").appendToCell("head","jobRemove","");
        for(var job = 0; job < Dobby.addedJobs.length;job++) {
            table.appendRow().appendToCell(-1,"jobIcon",Dobby.getJobIcon(Dobby.addedJobs[job].silver,Dobby.addedJobs[job].id,Dobby.addedJobs[job].x,Dobby.addedJobs[job].y)).appendToCell(-1,"jobName",Dobby.getJobName(Dobby.addedJobs[job].id)).appendToCell(-1,"jobStopMotivation",Dobby.createMinMotivationTextfield(Dobby.addedJobs[job].x,Dobby.addedJobs[job].y,Dobby.addedJobs[job].id,Dobby.addedJobs[job].stopMotivation)).appendToCell(-1,"jobRemove",Dobby.createRemoveJobButton(Dobby.addedJobs[job].x,Dobby.addedJobs[job].y,Dobby.addedJobs[job].id));
        }
        var buttonStart = new west.gui.Button("Start",function() {
            var parseSuccesfull = Dobby.parseStopMotivation();
            if(parseSuccesfull) {
               Dobby.isRunning = true;
               Dobby.run();
            }else {
                new UserMessage("Wrong format of set stop motivation", UserMessage.TYPE_ERROR).show();
            }
        });
        var buttonStop = new west.gui.Button("Stop",function() {
            Dobby.isRunning = false;
            Dobby.currentState = 0;
            Dobby.selectTab("choosenJobs");
        });
        htmlSkel.append(table.getMainDiv());
        $(".dobby_run",footerHtml).append(buttonStart.getMainDiv());
        $(".dobby_run",footerHtml).append(buttonStop.getMainDiv());
        htmlSkel.append(footerHtml);
        return htmlSkel;
    };
    Dobby.createMinMotivationTextfield = function(x,y,id,placeholder) {
        var componentId = "x-" + x + "y-" +y + "id-" + id;
        var textfield = new west.gui.Textfield();
        textfield.setId(componentId);
        textfield.setWidth(40);
        textfield.setValue(placeholder);
        return textfield.getMainDiv();
    };
    Dobby.createRemoveJobButton = function(x,y,id) {
        var buttonRemove = new west.gui.Button("Remove job",function() {
            Dobby.removeJob(x,y,id);
            Dobby.addedJobTablePosition.content = $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            Dobby.addedJobTablePosition.scrollbar = $(".dobby2window .tw2gui_scrollbar_pulley").css("top");
            Dobby.selectTab("choosenJobs");
        });
        buttonRemove.setWidth(100);
        return buttonRemove.getMainDiv();
    };
    Dobby.createSetGui = function() {
        if(Dobby.sets.length == 0) {
            return $("<span style=\'font-size:20px'\>No sets available</span>");
        }
        var htmlSkel = $("<div id =\'dobby2_sets_window'\ style=\'display:block;position:relative;width:650px;height:430px;'\><div id=\'dobby2_sets_left' style=\'display:block;position:absolute;width:250px;height:430px;top:0px;left:0px'\></div><div id=\'dobby2_sets_right' style=\'display:block;position:absolute;width:300px;height:410px;top:0px;left:325px'\></div></div>");
        var combobox = new west.gui.Combobox("combobox_sets");
        for(var i = 0 ; i < Dobby.sets.length;i++) {
            combobox.addItem(i.toString(),Dobby.sets[i].name);
        }
        combobox = combobox.select(Dobby.selectedSet);
        combobox.addListener(function(value) {
            Dobby.selectedSet = value;
            Dobby.selectTab("sets");
        });
        var buttonSelectTravelSet = new west.gui.Button("Select travel set",function() {
            Dobby.travelSet = Dobby.selectedSet;
            Dobby.selectTab("sets");
        });
        var buttonSelectJobSet = new west.gui.Button("Select job set",function() {
            Dobby.jobSet = Dobby.selectedSet;
            Dobby.selectTab("sets");
        });
        var buttonSelectHealthSet = new west.gui.Button("Select health set",function() {
            Dobby.healthSet = Dobby.selectedSet;
            Dobby.selectTab("sets");
        });
        var travelSetText = "None";
        if(Dobby.travelSet != -1) {
            travelSetText = Dobby.sets[Dobby.travelSet].name;
        }
        var jobSetText = "None";
        if(Dobby.jobSet != -1) {
            jobSetText = Dobby.sets[Dobby.jobSet].name;
        }
        var healthSetText = "None";
        if(Dobby.healthSet != -1) {
            healthSetText = Dobby.sets[Dobby.healthSet].name;
        }
        var left = $("<div></div>").append(new west.gui.Groupframe().appendToContentPane($("<span>Sets</span><br><br>")).appendToContentPane(combobox.getMainDiv()).appendToContentPane($("<br><br><span>Travel set:"+ travelSetText +"</span><br><br>")).appendToContentPane(buttonSelectTravelSet.getMainDiv()).appendToContentPane($("<br><br><span>Job set:"+ jobSetText +"</span><br><br>")).appendToContentPane(buttonSelectJobSet.getMainDiv()).appendToContentPane($("<br><br><span>Health set:"+ healthSetText +"</span><br><br>")).appendToContentPane(buttonSelectHealthSet.getMainDiv()).getMainDiv());
        var right = $("<div style=\'display:block;position:relative;width:300px;height:410px;'\></div>");
        //head div
        right.append("<div class=\'wear_head wear_slot'\ style=\'display:block;position:absolute;left:30px;top:1px;width:93px;height:94px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position: -95px 0;'\></div>");
        //chest div
        right.append("<div class=\'wear_body wear_slot'\ style=\'display:block;position:absolute;left:30px;top:106px;width:95px;height:138px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:0 0;'\></div>");
        //pants div
        right.append("<div class=\'wear_pants wear_slot'\ style=\'display:block;position:absolute;left:30px;top:258px;width:93px;height:138px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:0 0;'\></div>");
        //neck div
        right.append("<div class=\'wear_neck wear_slot'\ style=\'display:block;position:absolute;left:-47px;top:1px;width:74px;height:74px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-189px 0;'\></div>");
        //right arm div
        right.append("<div class=\'wear_right_arm wear_slot'\ style=\'display:block;position:absolute;left:-64px;top:79px;width:95px;height:138px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:0 0;'\></div>");
        //animal div
        right.append("<div class=\'wear_animal wear_slot'\ style=\'display:block;position:absolute;left:-64px;top:223px;width:93px;height:94px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-95px 0;'\></div>");
        //yield div
        right.append("<div class=\'wear_yield wear_slot'\ style=\'display:block;position:absolute;left:-47px;top:321px;width:74px;height:74px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-189px 0;'\></div>");
        //left arm div
        right.append("<div class=\'wear_left_arm wear_slot'\ style=\'display:block;position:absolute;left:127px;top:52px;width:95px;height:138px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:0 0;'\></div>");
        //belt div
        right.append("<div class=\'wear_belt wear_slot'\ style=\'display:block;position:absolute;left:127px;top:200px;width:93px;height:94px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-95px 0;'\></div>");
        //boots div
        right.append("<div class=\'wear_foot wear_slot'\ style=\'display:block;position:absolute;left:127px;top:302px;width:93px;height:94px;background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat;background-position:-95px 0;'\></div>");
        var keys = ["head","body","pants","neck","right_arm","animal","yield","left_arm","belt","foot"];
        Dobby.insertSetImages(right,keys);
        $("#dobby2_sets_left",htmlSkel).append(left);
        $("#dobby2_sets_right",htmlSkel).append(right);
        return htmlSkel;
    };
    Dobby.getImageSkel = function() {
        return $("<img src=\''\>");
    };
    Dobby.insertSetImages = function(html,keys) {
        for(var i = 0 ; i < keys.length;i++) {
            if(Dobby.sets[Dobby.selectedSet][keys[i]] != null) {
            $(".wear_"+keys[i],html).append(Dobby.getImageSkel().attr("src",Dobby.getItemImage(Dobby.sets[Dobby.selectedSet][keys[i]])));
            }
        }
        return html;
    };
    Dobby.createConsumablesTable = function() {
        var htmlSkel = $("<div id=\'consumables_overview'\></div>");
        var html = $("<div class = \'consumables_filter'\ style=\'position:relative;'\><div id=\'energy_consumables'\style=\'position:absolute;top:10px;left:15px;'\></div><div id=\'motivation_consumables'\style=\'position:absolute;top:10px;left:160px;'\></div><div id=\'health_consumables'\style=\'position:absolute;top:10px;left:320px;'\></div><div id=\'button_filter_consumables'\style=\'position:absolute;top:5px;left:460px;'\></div></div>");
        var table = new west.gui.Table();
        var consumableList = Dobby.filterConsumables(Dobby.consumableSelection.energy,Dobby.consumableSelection.motivation,Dobby.consumableSelection.health);
        table.addColumn("consumIcon","consumIcon").addColumn("consumName","consumName").addColumn("consumCount","consumCount").addColumn("consumEnergy","consumEnergy").addColumn("consumMotivation","consumMotivation").addColumn("consumHealth","consumHealth").addColumn("consumSelected","consumSelected");
        table.appendToCell("head","consumIcon","Image").appendToCell("head","consumName","Name").appendToCell("head","consumCount","Count").appendToCell("head","consumEnergy","Energy").appendToCell("head","consumMotivation","Motivation").appendToCell("head","consumHealth","Health").appendToCell("head","consumSelected","Use");
        for(var i = 0 ; i < consumableList.length;i++ ) {
            var checkbox = new west.gui.Checkbox();
            checkbox.setSelected(consumableList[i].selected);
            checkbox.setId(consumableList[i].id);
            checkbox.setCallback(function() {
                Dobby.changeConsumableSelection(parseInt(this.divMain.attr("id")),this.isSelected());
                Dobby.selectTab("consumables");
            });
            table.appendRow().appendToCell(-1,"consumIcon",Dobby.getConsumableIcon(consumableList[i].image)).appendToCell(-1,"consumName",consumableList[i].name).appendToCell(-1,"consumCount",consumableList[i].count).appendToCell(-1,"consumEnergy",consumableList[i].energy).appendToCell(-1,"consumMotivation",consumableList[i].motivation).appendToCell(-1,"consumHealth",consumableList[i].health).appendToCell(-1,"consumSelected",checkbox.getMainDiv());
        }
        var buttonSelect = new west.gui.Button("Select all",function() {
            Dobby.changeSelectionAllConsumables(true);
            Dobby.selectTab("consumables");
        });
        var buttonDeselect = new west.gui.Button("Deselect all",function() {
            Dobby.changeSelectionAllConsumables(false);
            Dobby.selectTab("consumables");
        });
        table.appendToFooter("consumEnergy",buttonSelect.getMainDiv());
        table.appendToFooter("consumHealth",buttonDeselect.getMainDiv());
        htmlSkel.append(table.getMainDiv());
        var checkboxEnergyConsumes = new west.gui.Checkbox();
        checkboxEnergyConsumes.setLabel("Energy consumables");
        checkboxEnergyConsumes.setSelected(Dobby.consumableSelection.energy);
        checkboxEnergyConsumes.setCallback(function() {
            Dobby.consumableSelection.energy = this.isSelected();
        });
        var checkboxMotivationConsumes = new west.gui.Checkbox();
        checkboxMotivationConsumes.setLabel("Motivation consumables");
        checkboxMotivationConsumes.setSelected(Dobby.consumableSelection.motivation);
        checkboxMotivationConsumes.setCallback(function() {
            Dobby.consumableSelection.motivation = this.isSelected();
        });
        var checkboxHealthConsumes = new west.gui.Checkbox();
        checkboxHealthConsumes.setLabel("Health consumables");
        checkboxHealthConsumes.setSelected(Dobby.consumableSelection.health);
        checkboxHealthConsumes.setCallback(function() {
            Dobby.consumableSelection.health = this.isSelected();
        });
        var buttonFilter = new west.gui.Button("Select",function() {
            Dobby.selectTab("consumables");
        });
        $("#energy_consumables",html).append(checkboxEnergyConsumes.getMainDiv());
        $("#motivation_consumables",html).append(checkboxMotivationConsumes.getMainDiv());
        $("#health_consumables",html).append(checkboxHealthConsumes.getMainDiv());
        $("#button_filter_consumables",html).append(buttonFilter.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };
    Dobby.createSettingsGui = function() {
        var htmlSkel = $("<div id=\'settings_overview'\ style = \'padding:10px;'\></div>");
        var checkboxAddEnergy = new west.gui.Checkbox();
        checkboxAddEnergy.setLabel("Add energy");
        checkboxAddEnergy.setSelected(Dobby.settings.addEnergy);
        checkboxAddEnergy.setCallback(function() {
            Dobby.settings.addEnergy = !Dobby.settings.addEnergy;
        });
        var checkboxAddMotivation = new west.gui.Checkbox();
        checkboxAddMotivation.setLabel("Add motivation");
        checkboxAddMotivation.setSelected(Dobby.settings.addMotivation);
        checkboxAddMotivation.setCallback(function() {
            Dobby.settings.addMotivation = !Dobby.settings.addMotivation;
        });
        var checkboxAddHealth = new west.gui.Checkbox();
        checkboxAddHealth.setLabel("Add motivation");
        checkboxAddHealth.setSelected(Dobby.settings.addHealth);
        checkboxAddHealth.setCallback(function() {
            Dobby.settings.addHealth = !Dobby.settings.addHealth;
        });
        var htmlHealthStop = $("<div></div>");
        htmlHealthStop.append("<span> Stoppage health percent value </span>");
        var healthStopTextfiled = new west.gui.Textfield("healthStop");
        healthStopTextfiled.setValue(Dobby.settings.healthStop);
        healthStopTextfiled.setWidth(100);
        htmlHealthStop.append(healthStopTextfiled.getMainDiv());
        var htmlSetWearDelay = $("<div></div>");
        htmlSetWearDelay.append("<span> Job set equip delay </span>");
        var setWearDelayTextfiled = new west.gui.Textfield("setWearDelay");
        setWearDelayTextfiled.setValue(Dobby.settings.setWearDelay);
        setWearDelayTextfiled.setWidth(100);
        htmlSetWearDelay.append(setWearDelayTextfiled.getMainDiv());
        var buttonApply = new west.gui.Button("Apply",function() {
            Dobby.settings.addEnergy = checkboxAddEnergy.isSelected();
            Dobby.settings.addMotivation = checkboxAddMotivation.isSelected();
            Dobby.settings.addHealth = checkboxAddHealth.isSelected();
            if(Dobby.isNumber(healthStopTextfiled.getValue())) {
                var healthStop = parseInt(healthStopTextfiled.getValue());
                healthStop = Math.min(30,healthStop);
                Dobby.settings.healthStop = healthStop;
            }
            if(Dobby.isNumber(setWearDelayTextfiled.getValue())) {
                var setWearDelay = parseInt(setWearDelayTextfiled.getValue());
                setWearDelay = Math.min(10,setWearDelay);
                Dobby.settings.setWearDelay = setWearDelay;
            }
            Dobby.selectTab("settings");
        })

        htmlSkel.append(checkboxAddEnergy.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxAddMotivation.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxAddHealth.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(htmlHealthStop);
        htmlSkel.append("<br>");
        htmlSkel.append(htmlSetWearDelay);
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        return htmlSkel;
    }
    Dobby.createMenuIcon = function() {
        var menuimage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAZABoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACggJ/8QAMBAAAQQBAgMGBAcBAAAAAAAABAECAwUGBxEACBIJExQVITEjM3a1NzlCUXFzsrT/xAAXAQADAQAAAAAAAAAAAAAAAAAFBgcE/8QAJhEAAgICAgEEAQUAAAAAAAAAAQIDBAUREiEGABMiMRQHFSNBgf/aAAwDAQACEQMRAD8ABeNE2KNOlN3ORrlVf1LtuiL6+yb7Jtt6cLU5AtEcSyDlVw/K4haG6mq8RxYSwJsfAl5Q5+SqO+sDhHkBlOnqVL8UAJ4J0gtbEPBEW4fZHyksVywpHIquRqNYxWpsiMVVT4jt1Tbb0avp6b8Jz7Ijn2zDTzRVukxddIMzGPN8bwPIYgxyBz4DTJr6Mc6aVGtrY6q3NiCktSZGjd2SOxrp54Ih2o3m1a1YxUZqu6vFajZgkvsllIIPz4u3+KN98uwujWP0e80PhXkdm+KOJu/l4yaqf3jHTZOtF8klDLViu0gJGdECyPKeI2q8S/NcSO0Jxeix3m51krMZoQ8cAgtaUmWnroIxQorIvGqee5mFGi2jhQyzUk6SGJGx+KJKfExrXsYkR9Lk92uRf2VFRU/lF9uEm88HZ42Ot93qDr1gOfxG6pSQgFXOBW0ckoWYOAogGjxYvYwo/wAkPjEjQCOOykloiSh+6WerVJZuDy2WL5PVWNhWWeL5EDY1ppQFgETSWDCAzQ55ByxSGIO5GTDzxyRSt6l6ZGOTddt+CuCyVe9RhSOb3Z6sMEFoMSHWZYlDH58WdWI2sgHFh/fIEBJ8qhmmzmSyTUFo18tfuZGrBBr8eKK3ZeZYIQrNwWEOI1jbTKoH2NMag1F5H+ZLTXQ5+vWaYI6o0+V+M7mvsA5jGVuVQQ+XW84bXpKPDFZTi0NlXkthuALMwaR4MlfI42O1+Q3OtO6LSasa6Ssly3HkzI6UGymjhQrJJDXS1gayLu6KQqqlj8m60Vs5TV7pFnGb0aE87P5d+Y/QuF/eMd4Pny1/NufrTTL7xZcDZppcvhbTzssTwW/iYVZQVUKoVgzsd6mOyCNlVIA7B0xVosXlaiQc2WxTR2DsNqZFDtxIUdbTXYJ0T3vv08nT6soCOWO0sLTB2YtluQWGN5EMHdFADW2OY8tKPEgKgsIfKZJKTDHCQ0ds3g4UcpKxLKvVlcbmukimFqun2UFqpU6qXLWBJIUqyv3IkR27kfMvxHo5VcjnKiqq8WcX+Hth9Lxf9AnGcs3zZf7H/wCl4meHokPdkWd0LzkHiGHS6IGxJs9No7J3rfRPqj+UWljiw8aQIQKQctJxckssW9/xqN/Z2B9n6H16/9k=';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=Dobby.loadJobs(); title="Dobby 2" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };
    $(document).ready(function() {
        try{
            Dobby.loadLanguage();
            Dobby.loadSets(function(){});
            Dobby.createMenuIcon();
        }catch(e) {
            console.log("exception occured");
        }
    });
})();