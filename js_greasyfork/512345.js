// ==UserScript==
// @name            Lord Voldemort
// @namespace       http://tampermonkey.net/
// @version         1.0.2
// @include         https://*.the-west.*/game.php*
// @exclude         https://*.events.the-west.*
// @icon            data:image/png;base64,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
// @grant           none
// @description The Dark Lord
// @downloadURL https://update.greasyfork.org/scripts/512345/Lord%20Voldemort.user.js
// @updateURL https://update.greasyfork.org/scripts/512345/Lord%20Voldemort.meta.js
// ==/UserScript==
 
(function() {
 
    function JobPrototype(x,y,id,groupId) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.groupId = groupId;
        this.silver = false;
        this.distance = 0;
        this.experience = 0;
        this.money = 0;
        this.motivation = 0;
        this.stopMotivation = 75;
        this.set = -1;
    };
    JobPrototype.prototype = {
        setSilver: function(isSilver) {
            this.silver = isSilver;
        },
        calculateDistance:function() {
            this.distance = GameMap.calcWayTime({x:this.x,y:this.y},Character.position);
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
        },
        setSet:function(setIndex) {
            this.set = setIndex;
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
 
    window.Dobby = {
         window:null,
         jobsLoaded:false,
         allJobs:[],
         allConsumables:[],
         consumableUsed:[],
         addedJobs:[],
         forts:[],
         homeTown:null,
         jobFilter:{filterOnlySilver:false,filterNoSilver:false,filterCenterJobs:false,filterJob:""},
         sortJobTableXp:0,
         sortJobTableDistance:0,
         jobTablePosition:{content:"0px",scrollbar:"0px"},
         addedJobTablePosition:{content:"0px",scrollbar:"0px"},
         consumableTablePosition:{content:"0px",scrollbar:"0px"},
         currentState:0,
         states:["idle","running","waiting for a consumable cooldown"],
         sets:null,
         selectedSet:0,
         selectedSleepPlace:-2,
         travelSet:-1,
         jobSet:-1,
         healthSet:-1,
         regenerationSet:-1,
         language:"",
         searchKeys:{
             "en_DK":{
                 energy:"Energy",
                 energyText:"Energy increase:",
                 motivation:"Work motivation",
                 motivationText:"Work motivation increase:",
                 health: "Health point bonus",
                 healthText:"Health point bonus:"
             },
             "sk_SK":{
                 energy:"Energie",
                 energyText:"Zvýšenie energie:",
                 motivation:"Pracovnej motivácie",
                 motivationText:"Zvýšenie pracovnej motivácie:",
                 health: "Bonus bodov zdravia",
                 healthText:"Bonus bodov zdravia:"
             },
             "cs_CZ":{
                 energy:"Energie",
                 energyText:"Zvýšení energie:",
                 motivation:"Pracovní motivace",
                 motivationText:"Zvýšení pracovní motivace:",
                 health: "Bonus zdraví",
                 healthText:"Bonus zdraví:"
             },
             "hu_HU":{
                 energy:"Energia növekedése:",
                 energyText:"Energia növekedése:",
                 motivation:"Munka motiváció növelése:",
                 motivationText:"Munka motiváció növelése:",
                 health: "Életerő bónusz",
                 healthText:"Életerő bónusz:"
             },
             "pl_PL":{
                 energy:"Wzrost energii:",
                 energyText:"Wzrost energii:",
                 motivation:"Zwiększenie motywacji do pracy:",
                 motivationText:"Zwiększenie motywacji do pracy:",
                 health: "Bonus Punktów życia:",
                 healthText:"Bonus Punktów życia:"
             },
             "ro_RO":{
                 energy:"Energie mărită:",
                 energyText:"Energie mărită:",
                 motivation:"Creştere a motivaţiei de muncă:",
                 motivationText:"Creştere a motivaţiei de muncă:",
                 health: "Puncte de viaţă:",
                 healthText:"Puncte de viaţă:"
             },
 
 
         },
         consumableSelection:{energy:false,motivation:false,health:false},
         isRunning:false,
         currentJob:{job:0,direction:true},
         jobRunning:false,
         settings:{
             addEnergy:false,
             addMotivation:false,
             addHealth:false,
             healthStop:1000,
             setWearDelay:5,
             jobDelayMin:0,
             jobDelayMax:0,
             enableRegeneration:false
         },
         statistics:{
             jobsInSession:0,
             xpInSession:0,
             totalJobs:0,
             totalXp:0,
         }
 
    };
    Dobby.isNumber = function(potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };
 
    Dobby.generateRandomNumber = function(min,max) {
        var minN = Math.min(min,max);
        var maxN = Math.max(min,max);
 
        var number =  Math.floor((minN + Math.random() * (maxN-minN+1)));
        console.log("Generated job set delay is :" + number + " seconds");
        return number;
    }
 
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
 
            for(var townNumber in r.towns) {
                if(r.towns[townNumber].town_id == Character.homeTown.town_id) {
                    Dobby.homeTown = r.towns[townNumber];
                    break;
                }
            }
 
            /*for(var fortNumber in r.forts) {
                for(var fortNumber2 in r.forts[fortNumber]) {
                    var fort = r.forts[fortNumber][fortNumber2];
                    if(fort['fort']['alliance_id'] == Character.homeTown.alliance_id) {
                       Dobby.forts.push(fort['fort']);
                    }
                }
            }*/
 
            for(var jobGroup in r.job_groups) {
                const groupId = parseInt(jobGroup);
                var group = r.job_groups[jobGroup];
                var jobsGroup = JobList.getJobsByGroupId(groupId);
                for(var tilecoord = 0; tilecoord < group.length;tilecoord++) {
                    var xCoord = Math.floor(group[tilecoord][0]/GameMap.tileSize);
                    var yCoord = Math.floor(group[tilecoord][1]/GameMap.tileSize);
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
                        jobs.push(new JobPrototype(group[tilecoord][0],group[tilecoord][1],jobsGroup[i].id, groupId));
                    }
                }
            }
            var toLoad = tiles.length;
            var loaded = 0;
                for(var blocks = 0; blocks < tiles.length;blocks++) {
                    GameMap.Data.Loader.load(tiles[blocks],function(){
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
        var html ='<div class="centermap" onclick="GameMap.center(' + x + ',' + y + ');"style="position: absolute;background-image: url(\'../images/map/icons/instantwork.png\');width: 20px;height: 20px;top: 0;right: 3px;cursor: pointer;"></div>';
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
        var jobData = GameMap.JobHandler.Featured[key];
        if(jobData == undefined || jobData[id] == undefined) {
            return false;
        }else {
            return jobData[id].silver;
        }
    };
    Dobby.compareUniqueJobs = function(job,jobs){
        for(var i = 0 ; i < jobs.length;i++) {
            if(jobs[i].id == job.id) {
                if(job.silver && !jobs[i].silver || (job.silver == jobs[i].silver &&job.distance < jobs[i].distance)) {
                    const j = jobs.at(i);
                    if ( !Dobby.checkIfSilver(j.x, j.y, j.id) )
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
    Dobby.updateJobDistances = function() {
        for(var i = 0; i < Dobby.allJobs.length;i++) {
            Dobby.allJobs[i].calculateDistance();
        }
    };
    Dobby.getAllUniqueJobs = function() {
        Dobby.updateJobDistances();
        var jobs = [];
        for(var i = 0 ; i < Dobby.allJobs.length;i++) {
            var currentJob = Dobby.allJobs[i];
            if(Dobby.jobFilter.filterJob != "") {
                if(!Dobby.getJobName(currentJob.id).toLowerCase().includes(Dobby.jobFilter.filterJob)) {
                    continue;
                }
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
                Dobby.consolidePosition(i);
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
    Dobby.findAddedJob = function(x,y,id) {
        for(var i = 0 ; i < Dobby.addedJobs.length;i++) {
            if(Dobby.addedJobs[i].x == x && Dobby.addedJobs[i].y == y && Dobby.addedJobs[i].id == id ) {
                return Dobby.addedJobs[i];
            }
        }
        return null;
    };
    Dobby.getJobSet = function(x,y,id) {
        var job = Dobby.findAddedJob(x,y,id);
        if(job != null)
            return job.set;
    };
    Dobby.setJobSet = function(x,y,id,set) {
        var job = Dobby.findAddedJob(x,y,id);
        if(job != null)
            return job.setSet(set);
    };
    Dobby.setSetForAllJobs = function() {
        for(var i = 0 ;i < Dobby.addedJobs.length;i++) {
            if(Dobby.addedJobs[i].set == -1)
            Dobby.addedJobs[i].setSet(Dobby.jobSet);
        }
    };
    Dobby.consolidePosition = function(removeIndex) {
        if(removeIndex <= Dobby.currentJob.job && Dobby.currentJob.job > 0) {
            Dobby.currentJob.job--;
        }
        if(Dobby.addedJobs.length == 1) {
            Dobby.currentJob.direction = true;
        }
    }
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
        if(Dobby.searchKeys[Dobby.language] == undefined) return;
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
            Dobby.addConsumable(healthConsumes[i]);
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
        Dobby.run();
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
        if(energyMissing == 100) {
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
        var consumables = Dobby.allConsumables;
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
    };
    Dobby.calculateDistances = function() {
        for(var i = 0; i < Dobby.addedJobs.length;i++) {
            Dobby.addedJobs[i].calculateDistance();
        }
    };
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
                distances[i][j] = distances[j][i] = GameMap.calcWayTime({x:Dobby.addedJobs[i].x,y:Dobby.addedJobs[i].y},{x:Dobby.addedJobs[j].x,y:Dobby.addedJobs[j].y});
            }
        }
        return distances;
    };
    Dobby.createRoute = function() {
        Dobby.currentJob = {job:0,direction:true}
        Dobby.calculateDistances();
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
        EquipManager.switchEquip(Dobby.sets[set].equip_manager_id);
        while(true) {
            let finished = await Dobby.isGearEquiped(Dobby.getSetItemArray(Dobby.sets[set]));
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
        if(bestGear == undefined) {
            return Promise.resolve(true);
        }
        for(var i = 0 ; i < bestGear.length;i++) {
            if(!Dobby.isWearing(bestGear[i]))
            Wear.carry(Bag.getItemByItemId(bestGear[i]));
        }
        setTimeout(() => {
            if (!Dobby.isGearEquiped(bestGear) && !Dobby.isGearEquiped(Dobby.getSetItemArray(Dobby.sets[job.set]))) {
                this.equipBestGear(job);
            }
        }, 10000)
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
    Dobby.getBackToJobAfterMotivationStop = function() {
 
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
        if(Dobby.settings.healthStop >= Character.health) {
            return true;
        }
        return false;
    };
    Dobby.isStopMotivationZero = function() {
        for(var i = 0 ; i < Dobby.addedJobs.length;i++) {
            if(Dobby.addedJobs[i].stopMotivation == 0) {
                return true;
            }
        }
        return false;
    };
    Dobby.canAddMissing = function(result) {
        if(!Dobby.settings.addMotivation && Dobby.jobsBelowMotivation(result) && !Dobby.isStopMotivationZero()) {
            alert("Can't continue because of motivation");
            return false;
        }
        if(!Dobby.settings.addEnergy && Character.energy == 0) {
            alert("Can't continue because of energy");
            return false;
        }
        if(!Dobby.settings.addHealth && Dobby.isHealthBelowLimit()) {
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
    Dobby.updateStatistics = function(oldXp) {
        var xpDifference = Character.experience - oldXp;
        Dobby.statistics.xpInSession += xpDifference;
        Dobby.statistics.totalXp += xpDifference;
    }
    Dobby.run = function() {
        Dobby.checkMotivation(0,[],function(result) {
            if((Dobby.isMotivationAbove(result) || Dobby.isStopMotivationZero()) && Character.energy > 0 && !Dobby.isHealthBelowLimit()){
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
        setTimeout(function() {
            Dobby.loadJobMotivation(index,async function(motivation) {
                if(Character.energy == 0 || Dobby.isHealthBelowLimit()) {
                    Dobby.run();
                }
                else if(motivation <= Dobby.addedJobs[index].stopMotivation && Dobby.addedJobs[index].stopMotivation > 0) {
                    Dobby.checkMotivation(0,[],function(result) {
                        if(Dobby.isMotivationAbove(result)) {
                            Dobby.changeJob();
                        }else {
                            Dobby.run();
                        }
                    });
                }else
                if(GameMap.calcWayTime(Character.position,{x:Dobby.addedJobs[index].x,y:Dobby.addedJobs[index].y}) == 0) {
                    var maxJobs;
                    (Premium.hasBonus('automation')) ? maxJobs = 9 : maxJobs = 4;
                    if(Dobby.addedJobs[index].stopMotivation != 0){
                    var numberOfJobs = Math.min(Math.min(motivation - Dobby.addedJobs[index].stopMotivation,Character.energy),maxJobs);
                    }else {
                        var numberOfJobs = Math.min(Character.energy,maxJobs);
                    }
                    Dobby.runJob(index,numberOfJobs);
                }else {
                    var equiped = await Dobby.equipSet(Dobby.travelSet);
                    Dobby.walkToJob(index);
                }
            });
        },Dobby.generateRandomNumber(Dobby.settings.jobDelayMin,Dobby.settings.jobDelayMax)*1000);
    };
    Dobby.getJobToWalkTo = function(job) {
        const jobGroup = JobList.getJobsByGroupId(job.groupId)

        const jobToWalkTo = jobGroup.map(j => 
            j.id
        ).map( id => {
            const j = JobsModel.getById(id)
            return {
                id: id,
                workpoints: j.workpoints 
            }
        }).reduce((prev, curr) => {
            return prev.workpoints < curr.workpoints ? prev : curr
        })

        return jobToWalkTo
    };
    Dobby.walkToJob = async function(index) {
        const job = Dobby.addedJobs[index]
        const jobToWalkTo = Dobby.getJobToWalkTo(job)
        JobWindow.startJob(jobToWalkTo.id,Dobby.addedJobs[index].x,Dobby.addedJobs[index].y,15);
        while(true) {
            if(GameMap.calcWayTime(Character.position,{x:Dobby.addedJobs[index].x,y:Dobby.addedJobs[index].y}) == 0) {
                break;
            }
            if(!Dobby.isRunning) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        Dobby.cancelJobs();
        if(Dobby.isRunning)
        Dobby.prepareJobRun(index);
    };
    Dobby.sleep = async function() {
        if(Dobby.settings.enableRegeneration && Dobby.selectedSleepPlace != -2) {
            //if sleep place is town
            if(Dobby.selectedSleepPlace == -1) {
                TaskQueue.add(new TaskWalk(Dobby.homeTown.town_id,'town'));
            }else {
                TaskQueue.add(new TaskWalk(Dobby.forts[Dobby.selectedSleepPlace].fort_id,'fort'));
            }
 
            while(true) {
            if(GameMap.calcWayTime(Character.position,{x:Dobby.addedJobs[index].x,y:Dobby.addedJobs[index].y}) == 0) {
                break;
            }
            if(!Dobby.isRunning) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        }
 
    }
    Dobby.changeJob = function() {
        (Dobby.currentJob.direction) ? Dobby.currentJob.job++ : Dobby.currentJob.job--;
        if(Dobby.currentJob.job == Dobby.addedJobs.length) {
            Dobby.currentJob.job--;
            Dobby.currentJob.direction = false;
        } else if(Dobby.currentJob.job < 0) {
            Dobby.currentJob.job++;
            Dobby.currentJob.direction = true;
        }
        Dobby.setCookies();
        Dobby.run();
    };
    Dobby.runJob = async function(jobIndex,jobCount) {
        Dobby.statistics.jobsInSession += jobCount;
        Dobby.statistics.totalJobs += jobCount;
        var oldXp = Character.experience;
        await Dobby.equipBestGear(Dobby.addedJobs[jobIndex].id);
        if(TaskQueue.busy && TaskQueue.toAdd.length > 1) {
            TaskQueue.busy = false;
            TaskQueue.toAdd = [];
        }
        for(var i = 0; i < jobCount;i++) {
            JobWindow.startJob(Dobby.addedJobs[jobIndex].id,Dobby.addedJobs[jobIndex].x,Dobby.addedJobs[jobIndex].y,15);
        }
        await new Promise(r => setTimeout(r, Dobby.settings.setWearDelay * 1000));
        Dobby.equipSet(Dobby.addedJobs[jobIndex].set);
        while(true) {
            if(TaskQueue.queue.length == 0) {
                Dobby.updateStatistics(oldXp);
                Dobby.setCookies();
                Dobby.prepareJobRun(jobIndex);
                return;
            }
            if(!Dobby.isRunning || Dobby.isHealthBelowLimit()) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        Dobby.statistics.jobsInSession -= TaskQueue.queue.length;
        Dobby.statistics.totalJobs -= TaskQueue.queue.length;
        Dobby.updateStatistics(oldXp);
        Dobby.setCookies();
        Dobby.cancelJobs();
 
    };
    Dobby.cancelJobs = function() {
        if(TaskQueue.queue.length > 0)
            TaskQueue.cancelAll();
    };
    Dobby.setCookies = function() {
        var expiracyDateTemporary = new Date();
        var hour = expiracyDateTemporary.getHours();
        expiracyDateTemporary.setHours(2,0,0);
        if(hour > 2)
            expiracyDateTemporary.setDate(expiracyDateTemporary.getDate() + 1);
        var temporaryObject ={
            addedJobs:Dobby.addedJobs,
            travelSet:Dobby.travelSet,
            jobSet:Dobby.jobSet,
            healthSet:Dobby.healthSet,
            currentJob:Dobby.currentJob
        };
        var expiracyDatePernament = new Date();
        expiracyDatePernament.setDate(expiracyDatePernament.getDate() + 360000);
        var pernamentObject = {
            settings:Dobby.settings,
            totalJobs:Dobby.statistics.totalJobs,
            totalXp:Dobby.statistics.totalXp
        };
        var jsonTemporary = JSON.stringify(temporaryObject);
        var jsonPernament = JSON.stringify(pernamentObject);
        document.cookie = "dobby2temporary=" + jsonTemporary + ";expires=" + expiracyDateTemporary.toGMTString() + ";";
        document.cookie = "dobby2pernament=" + jsonPernament + ";expires=" + expiracyDatePernament.toGMTString() + ";";
    };
    Dobby.getCookies = function() {
        var cookie = document.cookie.split("=");
        for(var i = 0; i < cookie.length;i++) {
            if(cookie[i].includes("dobby2temporary")) {
                var obj = cookie[i+1].split(";");
                var tempObject = JSON.parse(obj[0]);
                var tmpAddedJobs = tempObject.addedJobs;
                for(var j = 0 ; j < tmpAddedJobs.length;j++) {
                    var jobP = new JobPrototype(tmpAddedJobs[j].x,tmpAddedJobs[j].y,tmpAddedJobs[j].id,tmpAddedJobs[j].groupId);
                    jobP.setSilver(tmpAddedJobs[j].silver);
                    jobP.distance = tmpAddedJobs[j].distance;
                    jobP.setExperience(tmpAddedJobs[j].experience);
                    jobP.setMoney(tmpAddedJobs[j].money);
                    jobP.setMotivation(tmpAddedJobs[j].motivation);
                    jobP.setStopMotivation(tmpAddedJobs[j].stopMotivation);
                    jobP.setSet(tmpAddedJobs[j].set);
                    Dobby.addedJobs.push(jobP);
                }
                Dobby.travelSet = tempObject.travelSet;
                Dobby.jobSet = tempObject.jobSet;
                Dobby.healthSet = tempObject.healthSet;
                Dobby.currentJob = tempObject.currentJob;
                Dobby.setSetForAllJobs();
            }
            if(cookie[i].includes("dobby2pernament")) {
                var obj = cookie[i+1].split(";");
                var pernamentObject = JSON.parse(obj[0]);
                Dobby.settings = pernamentObject.settings;
                Dobby.statistics.totalJobs = pernamentObject.totalJobs;
                Dobby.statistics.totalXp = pernamentObject.totalXp;
            }
        }
    };
    Dobby.createWindow = function() {
        var window = wman.open("dobby").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("Voldemort");
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
                    Dobby.window.appendToContentPane(content);
                    $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({"top":Dobby.addedJobTablePosition.content});
                    $(".dobby2window .tw2gui_scrollbar_pulley").css({"top":Dobby.addedJobTablePosition.scrollbar});
                    Dobby.addAddedJobsTableCss();
                    break;
                case "consumables":
                    Dobby.removeActiveTab(this);
                    Dobby.removeWindowContent();
                    Dobby.addActiveTab("consumables",this);
                    Dobby.findAllConsumables();
                    content.append(Dobby.createConsumablesTable());
                    Dobby.window.appendToContentPane(content);
                    $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({"top":Dobby.consumableTablePosition.content});
                    $(".dobby2window .tw2gui_scrollbar_pulley").css({"top":Dobby.consumableTablePosition.scrollbar});
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
                    content.append(Dobby.createStatisticsGui());
                    Dobby.window.appendToContentPane(content);
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
        $(".dobby2window .jobName").css({"width":"130px"});
        $(".dobby2window .jobStopMotivation").css({"width":"110px"});
        $(".dobby2window .jobRemove").css({"width":"105px"});
        $(".dobby2window .jobSet").css({"width":"100px"});
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
        table.addColumn("jobIcon","jobIcon").addColumn("jobName","jobName").addColumn("jobStopMotivation","jobStopMotivation").addColumn("jobSet","jobSet").addColumn("jobRemove","jobRemove");
        table.appendToCell("head","jobIcon","Job icon").appendToCell("head","jobName","Job name").appendToCell("head","jobStopMotivation","Stop motivation").appendToCell("head","jobSet","Job set").appendToCell("head","jobRemove","");
        for(var job = 0; job < Dobby.addedJobs.length;job++) {
            table.appendRow().appendToCell(-1,"jobIcon",Dobby.getJobIcon(Dobby.addedJobs[job].silver,Dobby.addedJobs[job].id,Dobby.addedJobs[job].x,Dobby.addedJobs[job].y)).appendToCell(-1,"jobName",Dobby.getJobName(Dobby.addedJobs[job].id)).appendToCell(-1,"jobStopMotivation",Dobby.createMinMotivationTextfield(Dobby.addedJobs[job].x,Dobby.addedJobs[job].y,Dobby.addedJobs[job].id,Dobby.addedJobs[job].stopMotivation)).appendToCell(-1,"jobSet",Dobby.createComboxJobSets(Dobby.addedJobs[job].x,Dobby.addedJobs[job].y,Dobby.addedJobs[job].id)).appendToCell(-1,"jobRemove",Dobby.createRemoveJobButton(Dobby.addedJobs[job].x,Dobby.addedJobs[job].y,Dobby.addedJobs[job].id));
        }
        var buttonStart = new west.gui.Button("Start",function() {
            var parseSuccesfull = Dobby.parseStopMotivation();
            if(parseSuccesfull) {
                Dobby.createRoute();
                Dobby.isRunning = true;
                Dobby.setCookies();
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
    Dobby.createComboxJobSets = function(x,y,id) {
        var combobox = new west.gui.Combobox();
        Dobby.addComboboxItems(combobox);
        combobox = combobox.select(Dobby.getJobSet(x,y,id));
        combobox.setWidth(60);
        combobox.addListener(function(value) {
            Dobby.setJobSet(x,y,id,value);;
            Dobby.selectTab("choosenJobs");
        });
        return combobox.getMainDiv();
    };
    Dobby.addComboboxItems = function(combobox) {
        combobox.addItem(-1,"None");
        for(var i = 0 ; i < Dobby.sets.length;i++) {
            combobox.addItem(i.toString(),Dobby.sets[i].name);
        }
    };
    Dobby.createSetGui = function() {
        if(Dobby.sets.length == 0) {
            return $("<span style=\'font-size:20px'\>No sets available</span>");
        }
        var htmlSkel = $("<div id =\'dobby2_sets_window'\ style=\'display:block;position:relative;width:650px;height:430px;'\><div id=\'dobby2_sets_left' style=\'display:block;position:absolute;width:250px;height:430px;top:0px;left:0px'\></div><div id=\'dobby2_sets_right' style=\'display:block;position:absolute;width:300px;height:410px;top:0px;left:325px'\></div></div>");
        var combobox = new west.gui.Combobox("combobox_sets");
        Dobby.addComboboxItems(combobox);
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
            Dobby.setSetForAllJobs();
            Dobby.selectTab("sets");
        });
        var buttonSelectHealthSet = new west.gui.Button("Select health set",function() {
            Dobby.healthSet = Dobby.selectedSet;
            Dobby.selectTab("sets");
        });
        var buttonSelectRegenerationSet = new west.gui.Button("Select regeneration set",function() {
            Dobby.regenerationSet = Dobby.selectedSet;
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
        var regenerationSetText = "None";
        if(Dobby.regenerationSet != -1) {
            regenerationSetText = Dobby.sets[Dobby.regenerationSet].name;
        }
        const left = $("<div></div>")
        .append(new west.gui.Groupframe()
            .appendToContentPane($("<span>Sets</span><br><br>"))
            .appendToContentPane(combobox.getMainDiv())
            .appendToContentPane($("<br><br><span>Travel set:"+ travelSetText +"</span><br><br>"))
            .appendToContentPane(buttonSelectTravelSet.getMainDiv())
            .appendToContentPane($("<br><br><span>Job set:"+ jobSetText +"</span><br><br>"))
            .appendToContentPane(buttonSelectJobSet.getMainDiv())
            // Remove Health set related elements
            .appendToContentPane($("<br><br><span>Health set:"+ healthSetText +"</span><br><br>"))
            .appendToContentPane(buttonSelectHealthSet.getMainDiv())
            // Remove regen set related elements
            // .appendToContentPane($("<br><br><span>Regen set:"+ regenSetText +"</span><br><br>"))
            // .appendToContentPane(buttonSelectRegenSet.getMainDiv())
            .getMainDiv()
        );
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
        if(Dobby.selectedSet != -1)
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
                Dobby.consumableTablePosition.content = $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css("top");;
                Dobby.consumableTablePosition.scrollbar = $(".dobby2window .tw2gui_scrollbar_pulley").css("top");
                Dobby.selectTab("consumables");
                Dobby.setCookies();
            });
            table.appendRow().appendToCell(-1,"consumIcon",Dobby.getConsumableIcon(consumableList[i].image)).appendToCell(-1,"consumName",consumableList[i].name).appendToCell(-1,"consumCount",consumableList[i].count).appendToCell(-1,"consumEnergy",consumableList[i].energy).appendToCell(-1,"consumMotivation",consumableList[i].motivation).appendToCell(-1,"consumHealth",consumableList[i].health).appendToCell(-1,"consumSelected",checkbox.getMainDiv());
        }
        var buttonSelect = new west.gui.Button("Select all",function() {
            Dobby.changeSelectionAllConsumables(true);
            Dobby.selectTab("consumables");
            Dobby.setCookies();
        });
        var buttonDeselect = new west.gui.Button("Deselect all",function() {
            Dobby.changeSelectionAllConsumables(false);
            Dobby.selectTab("consumables");
            Dobby.setCookies();
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
 
    Dobby.addSleepPlacesItems = function(combobox) {
        combobox.addItem(-2,"None");
        if(Dobby.homeTown != null) {
        combobox.addItem(-1,Dobby.homeTown.name);
        }
        for(var i = 0 ; i < Dobby.forts.length;i++) {
            var type = (Dobby.forts[i].type == 0) ? "Small" : (Dobby.forts[i].type == 1)? "Medium" : "Large";
            combobox.addItem(i.toString(),Dobby.forts[i].name + "  -  " + type );
        }
    }
 
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
        checkboxAddHealth.setLabel("Add health");
        checkboxAddHealth.setSelected(Dobby.settings.addHealth);
        checkboxAddHealth.setCallback(function() {
            Dobby.settings.addHealth = !Dobby.settings.addHealth;
        });
        var htmlHealthStop = $("<div></div>");
        htmlHealthStop.append("<span> Stoppage health value </span>");
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
 
        var htmlJobDelay = $("<div></div>");
        htmlJobDelay.append("<span> Random delay between jobs(seconds)</span>");
        var jobDelayTextFieldMin = new west.gui.Textfield("jobDelay");
        jobDelayTextFieldMin.setValue(Dobby.settings.jobDelayMin);
        jobDelayTextFieldMin.setWidth(50);
        var jobDelayTextFieldMax = new west.gui.Textfield("jobDelay");
        jobDelayTextFieldMax.setValue(Dobby.settings.jobDelayMax);
        jobDelayTextFieldMax.setWidth(50);
 
        htmlJobDelay.append(jobDelayTextFieldMin.getMainDiv());
        htmlJobDelay.append("<span> - </span>");
        htmlJobDelay.append(jobDelayTextFieldMax.getMainDiv());
 
        var htmlRegeneration = $("<div></div>");
        var checkboxEnableRegeneration = new west.gui.Checkbox();
        checkboxEnableRegeneration.setLabel("Enable regeneration");
        checkboxEnableRegeneration.setSelected(Dobby.settings.enableRegeneration);
        checkboxEnableRegeneration.setCallback(function() {
            Dobby.settings.enableRegeneration = !Dobby.settings.enableRegeneration;
            if(Dobby.settings.enableRegeneration) {
                $("#regeneration_choices_container").css('visibility','visible');
            }else {
                $("#regeneration_choices_container").css('visibility','hidden');
            }
        });
 
        var sleepPlacesCombobox = new west.gui.Combobox("sleep_places");
        Dobby.addSleepPlacesItems(sleepPlacesCombobox);
        sleepPlacesCombobox = sleepPlacesCombobox.select(Dobby.selectedSleepPlace);
        sleepPlacesCombobox.addListener(function(value) {
            Dobby.selectedSleepPlace = value;
            Dobby.selectTab("settings");
        });
 
        var htmlRegenerationChoices = $("<div id='regeneration_choices_container'></div>");
        htmlRegenerationChoices.css({'display':'inline-block','padding-left':'10px','visibility':(Dobby.settings.enableRegeneration)?'visible':"hidden"});
        htmlRegenerationChoices.append($("<span>Sleep place: </span>"));
        htmlRegenerationChoices.append(sleepPlacesCombobox.getMainDiv());
 
        htmlRegeneration.append(checkboxEnableRegeneration.getMainDiv());
        htmlRegeneration.append(htmlRegenerationChoices);
 
        var buttonApply = new west.gui.Button("Apply",function() {
            Dobby.settings.addEnergy = checkboxAddEnergy.isSelected();
            Dobby.settings.addMotivation = checkboxAddMotivation.isSelected();
            Dobby.settings.addHealth = checkboxAddHealth.isSelected();
            if(Dobby.isNumber(healthStopTextfiled.getValue())) {
                var healthStop = parseInt(healthStopTextfiled.getValue());
                Dobby.settings.healthStop = healthStop;
            }
            if(Dobby.isNumber(setWearDelayTextfiled.getValue())) {
                var setWearDelay = parseInt(setWearDelayTextfiled.getValue());
                setWearDelay = Math.min(10,setWearDelay);
                Dobby.settings.setWearDelay = setWearDelay;
            }
            if(Dobby.isNumber(jobDelayTextFieldMin.getValue())) {
                var jobDelayTimeMin = parseInt(jobDelayTextFieldMin.getValue());
                Dobby.settings.jobDelayMin = jobDelayTimeMin;
            }else {
                Dobby.settings.jobDelayMin = 0;
                Dobby.settings.jobDelayMax = 0;
                new UserMessage("Wrong format of delay job min value. Please set a number.", UserMessage.TYPE_ERROR).show();
            }
            if(Dobby.isNumber(jobDelayTextFieldMax.getValue())) {
                var jobDelayTimeMax = parseInt(jobDelayTextFieldMax.getValue());
                Dobby.settings.jobDelayMax = jobDelayTimeMax;
            }else {
                Dobby.settings.jobDelayMin = 0;
                Dobby.settings.jobDelayMax = 0;
                new UserMessage("Wrong format of delay job max value. Please set a number.", UserMessage.TYPE_ERROR).show();
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
        htmlSkel.append(htmlJobDelay);
        htmlSkel.append("<br>");
        htmlSkel.append(htmlRegeneration);
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        return htmlSkel;
    };
    Dobby.createStatisticsGui = function() {
        var htmlSkel = $("<div id=\'statistics_overview'\></div>");
        htmlSkel.append($("<span>Job count in this session: " + Dobby.statistics.jobsInSession + "</span><br>"));
        htmlSkel.append($("<span>Xp count in this session: " + Dobby.statistics.xpInSession + "</span><br>"));
        htmlSkel.append($("<span>Job count total: " + Dobby.statistics.totalJobs + "</span><br>"));
        htmlSkel.append($("<span>Xp count total: " + Dobby.statistics.totalXp + "</span><br>"));
        return htmlSkel;
    };
    Dobby.createMenuIcon = function() {
        var menuimage = 'data:image/png;base64,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';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=Dobby.loadJobs(); title="Lord Voldemort" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };
    $(document).ready(function() {
        try{
            Dobby.loadLanguage();
            Dobby.loadSets(function(){});
            Dobby.getCookies();
            Dobby.createMenuIcon();
        }catch(e) {
            console.log("exception occured");
        }
    });
})();