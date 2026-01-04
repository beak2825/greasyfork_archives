// ==UserScript==
// @name         MEGA UP
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Super UP
// @author       Annie Oakley
// @include https://*.the-west.*/game.php*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCAAZABkBAREA/8QAGwAAAQQDAAAAAAAAAAAAAAAAAAYHCAkBAgX/xAApEAABAwQCAgECBwAAAAAAAAABAgMEBQYHEQASCCETIjEJFiMyUVJj/9oACAEBAAA/AK1ottXHNoky5YVv1ORSKetDcyoNQ3FxY61kBCXHQnogqKkgAkEkjX34Vu2rjtmQzEuS36nSX5MdEplqfDcjrcYWSEupS4ASglKtKA0dHX25ziCPRGuY5Yd49Y/unI/4cC7Jx/QpdeqFazDDFTjwUfIuNFSuKVOugftQkNtqKj6AOz6G+Ppnu1MZZDu/ydy9WsOwsp1PHEOgW3Qqe4ZKwmQlj5JKEiOoL+lcoFfXSgGlDsn2eRL84/GeHSryg13CWJHqLGptg025b9pFM2uLbsp75T9YWrbe0NL2n/Ptr2dwy0f4PFbYeXsq4tTOTjXJFy2qmppSmamj1N2KJATvr3CCASNnR+42dHjo458vrzxX4/3RiCy0VWm3FdNzs3E/d8WsuMy2A2Gf00JSnspSyyrstTnsOKBB2eNkvMuW3RdIeyXcrv53SlFylypOLNYSkEJEkqJLoAUoAH0AdD1xH91f2PNeHDhz/9k=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458701/MEGA%20UP.user.js
// @updateURL https://update.greasyfork.org/scripts/458701/MEGA%20UP.meta.js
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
        this.set = -1;
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

     BombaBot = {
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
         consumableTablePosition:{content:"0px",scrollbar:"0px"},
         currentState:0,
         states:[" Inativo"," Trabalhando"," Aguardando tempo para usar consumível"],
         sets:null,
         selectedSet:0,
         travelSet:-1,
         jobSet:-1,
         healthSet:-1,
         language:"",
         searchKeys:{
               "pt_BR":{
                  energy:"Aumento de energia",
                  energyText:"Aumento de energia",
                  motivation:"Aumento da motivação de trabalho",
                  motivationText:"Aumento da motivação de trabalho",
                  health: "Bônus de saúde",
                  healthText: "Bônus de saúde",
               }
         },
         consumableSelection:{energy:false,motivation:false,health:false},
         isRunning:false,
         currentJob:{job:0,direction:true},
         jobRunning:false,
         settings:{
             energyMinimum:5,
             healthMinimum:5,
             healthStop:10,
             useGoldOnEnergyDepletion:false,
             setWearDelay:5,
             motivationConsumable:'none',
             energyConsumable:'none',
             healthConsumable:'none'
         },
         statistics:{
             jobsInSession:0,
             xpInSession:0,
             totalJobs:0,
             totalXp:0,
         }

    };
    BombaBot.isNumber = function(potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };

    BombaBot.loadJobs = function() {
        if(!BombaBot.jobsLoaded) {
        new UserMessage("Carregando... ", UserMessage.TYPE_HINT).show();
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
                            BombaBot.jobsLoaded = true;
                            BombaBot.allJobs = jobs;
                            BombaBot.findAllConsumables();
                            BombaBot.createWindow();
                        }
                    });
                }
        });
      }else {
          BombaBot.findAllConsumables();
          BombaBot.createWindow();
      }
    };
    BombaBot.loadJobData = function(callback) {
        Ajax.get('work','index',{},function(r) {
            if(r.error) {
                console.log(r.error);
                return;
            }
            JobsModel.initJobs(r.jobs);
            callback();
        });
    };
    BombaBot.loadSets = function(callback) {
        Ajax.remoteCallMode('inventory', 'show_equip', {}, function(r) {
            BombaBot.sets = r.data;
            callback();
        });
    };
    BombaBot.loadLanguage = function() {
        Ajax.remoteCall("settings", "settings", {}, function(resp) {
             BombaBot.language = resp.lang.account.key;
         });
    };
    BombaBot.loadJobMotivation = function(index,callback) {
        Ajax.get('job','job',{jobId:BombaBot.addedJobs[index].id,x:BombaBot.addedJobs[index].x,y:BombaBot.addedJobs[index].y},function(r){
            callback(r.motivation*100);
        });
    };
    BombaBot.getJobName = function(id) {
        return JobList.getJobById(id).name;
    };
    BombaBot.getJobIcon = function(silver,id,x,y) {
        var html ='<div class="centermap" onclick="Map.center(' + x + ',' + y + ');"style="position: absolute;background-image: url(\'../images/map/icons/instantwork.png\');width: 20px;height: 20px;top: 0;right: 3px;cursor: pointer;"></div>';
        var silverHtml = "";
        if(silver) {
             silverHtml = '<div class="featured silver"></div>';
         }
        return'<div class="job" style="left: 0; top: 0; position: relative;"><div  onclick="" class="featured"></div>' + silverHtml + html + '<img src="../images/jobs/' + JobList.getJobById(id).shortname + '.png" class="job_icon"></div>';
    };
    BombaBot.getConsumableIcon = function(src) {
        return "<div><img src ="+ src + "></div>";
    };
    BombaBot.checkIfSilver = function(x,y,id) {
        var key = x + "-" + y;
        var jobData = Map.JobHandler.Featured[key];
        if(jobData == undefined || jobData[id] == undefined) {
            return false;
        }else {
            return jobData[id].silver;
        }
    };
    BombaBot.compareUniqueJobs = function(job,jobs){
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
    BombaBot.findJobData = function(job) {
        for(var i = 0 ; i < JobsModel.Jobs.length;i++) {
            if(JobsModel.Jobs[i].id == job.id) {
                return JobsModel.Jobs[i];
            }
        }
    };
    BombaBot.parseJobData = function(jobs) {
        for(var job = 0 ; job < jobs.length;job++) {
            var currentJob = jobs[job];
            var data = BombaBot.findJobData(currentJob);
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
    BombaBot.getAllUniqueJobs = function() {
        var jobs = [];
        for(var i = 0 ; i < BombaBot.allJobs.length;i++) {
            var currentJob = BombaBot.allJobs[i];
            if(BombaBot.jobFilter.filterJob != "") {
                if(!BombaBot.getJobName(currentJob.id).toLowerCase().includes(BombaBot.jobFilter.filterJob)) {
                    continue;
                }
            }
            if(!JobList.getJobById(currentJob.id).canDo()) {
                continue;
            }
            if(BombaBot.checkIfJobAdded(currentJob.id)) {
                continue;
            }
            var isSilver = BombaBot.checkIfSilver(currentJob.x,currentJob.y,currentJob.id);
            currentJob.silver = isSilver;
            currentJob.calculateDistance();
            if(isSilver && BombaBot.jobFilter.filterNoSilver) {
                continue;
            }
            if(!isSilver && BombaBot.jobFilter.filterOnlySilver) {
                continue;
            }
            if(BombaBot.jobFilter.filterCenterJobs && currentJob.id < 131 ) {
                continue;
            }
            BombaBot.compareUniqueJobs(currentJob,jobs);
        }
        BombaBot.parseJobData(jobs);

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
        if(BombaBot.sortJobTableXp == 1) {
            jobs.sort(experienceSort);
        }
        if(BombaBot.sortJobTableXp == -1) {
            jobs.sort(reverseExperienceSort);
        }
        if(BombaBot.sortJobTableDistance == 1) {
            jobs.sort(distanceSort);
        }
        if(BombaBot.sortJobTableDistance == -1) {
            jobs.sort(reverseDistanceSort);
        }
        return jobs;
    };
    BombaBot.findJob = function(x,y,id) {
        for(var i = 0 ; i < BombaBot.allJobs.length;i++) {
            if(BombaBot.allJobs[i].id == id && BombaBot.allJobs[i].x == x && BombaBot.allJobs[i].y == y) {
                return BombaBot.allJobs[i];
            }
        }
    };
    BombaBot.addJob = function(x,y,id) {
        if(!BombaBot.checkIfJobAdded(id)) {
        BombaBot.addedJobs.push(BombaBot.findJob(x,y,id));
        }
    };
    BombaBot.removeJob = function(x,y,id) {
        for(var i = 0; i < BombaBot.addedJobs.length;i++) {
            if(BombaBot.addedJobs[i].id == id && BombaBot.addedJobs[i].x == x && BombaBot.addedJobs[i].y == y) {
                BombaBot.addedJobs.splice(i,1);
                BombaBot.consolidePosition(i);
                break;
            }
        }
    };
    BombaBot.checkIfJobAdded = function(id) {
        for(var i = 0; i < BombaBot.addedJobs.length;i++) {
            if(BombaBot.addedJobs[i].id == id ) {
                return true;
            }
        }
        return false;
    };
    BombaBot.findAddedJob = function(x,y,id) {
        for(var i = 0 ; i < BombaBot.addedJobs.length;i++) {
            if(BombaBot.addedJobs[i].x == x && BombaBot.addedJobs[i].y == y && BombaBot.addedJobs[i].id == id ) {
                return BombaBot.addedJobs[i];
            }
        }
        return null;
    };
    BombaBot.getJobSet = function(x,y,id) {
        var job = BombaBot.findAddedJob(x,y,id);
        if(job != null)
            return job.set;
    };
    BombaBot.setJobSet = function(x,y,id,set) {
        var job = BombaBot.findAddedJob(x,y,id);
        if(job != null)
            return job.setSet(set);
    };
    BombaBot.setSetForAllJobs = function() {
        for(var i = 0 ;i < BombaBot.addedJobs.length;i++) {
            if(BombaBot.addedJobs[i].set == -1)
            BombaBot.addedJobs[i].setSet(BombaBot.jobSet);
        }
    };
    BombaBot.consolidePosition = function(removeIndex) {
        if(removeIndex <= BombaBot.currentJob.job && BombaBot.currentJob.job > 0) {
            BombaBot.currentJob.job--;
        }
        if(BombaBot.addedJobs.length == 1) {
            BombaBot.currentJob.direction = true;
        }
    }
    BombaBot.parseStopMotivation = function() {
        for(var i = 0 ; i < BombaBot.addedJobs.length;i++) {
            var stopMotivation = $(".dobby2window #x-" + BombaBot.addedJobs[i].x + "y-" + BombaBot.addedJobs[i].y + "id-" + BombaBot.addedJobs[i].id).prop("value");
            if(BombaBot.isNumber(stopMotivation)) {
                BombaBot.addedJobs[i].setStopMotivation(parseInt(stopMotivation));
            }else {
                return false;
            }
        }
        return true;
    };
    BombaBot.getItemImage = function(id) {
      return ItemManager.get(id).wear_image;
    };
    BombaBot.findAllConsumables = function() {
        if(BombaBot.searchKeys[BombaBot.language] == undefined) return;
        var energyConsumes = Bag.search(BombaBot.searchKeys[BombaBot.language].energy);
        for(var i = 0 ; i < energyConsumes.length;i++) {
            BombaBot.addConsumable(energyConsumes[i]);
        }
        var motivationConsumes = Bag.search(BombaBot.searchKeys[BombaBot.language].motivation);
        for(var i = 0; i < motivationConsumes.length;i++) {
          BombaBot.addConsumable(motivationConsumes[i]);
        }
        var healthConsumes = Bag.search(BombaBot.searchKeys[BombaBot.language].health);
        for(var i = 0; i < healthConsumes.length;i++) {
            BombaBot.addConsumable(healthConsumes[i]);
        }
    };
    BombaBot.CheckIfConsumableAdded = function(item) {
        if(item == undefined)
            return true;
        for(var i = 0 ; i < BombaBot.allConsumables.length;i++) {
            if(BombaBot.allConsumables[i].id == item.obj.item_id) {
                return true;
            }
        }
        return false;
    };
    BombaBot.addConsumable = function(item) {
        if(BombaBot.CheckIfConsumableAdded(item)) {
            return;
        }
        var consumable = new ConsumablePrototype(item.obj.item_id,item.obj.image,item.obj.name);
        var bonuses = BombaBot.parseConsumableBonuses(item.obj.usebonus);
        if(bonuses[0] == 0 && bonuses[1] == 0 && bonuses[2] == 0)
        return;
        consumable.setEnergy(bonuses[0]);
        consumable.setMotivation(bonuses[1]);
        consumable.setHealth(bonuses[2]);
        consumable.setCount(item.count);
        BombaBot.allConsumables.push(consumable);
    };
    BombaBot.removeConsumable = function(item) {
        var index;
        for(var i = 0 ; i < BombaBot.allConsumables.length;i++) {
            if(BombaBot.allConsumables[i].id == item.id) {
                index = i;
                break;
            }
        }
        if(index != undefined) {
            if(BombaBot.allConsumables[index].count > 1) {
                BombaBot.allConsumables[index].count--;
            }else {
                BombaBot.allConsumables.slice(index,1);
            }
        }
    };
    BombaBot.parseConsumableBonuses = function(bonuses) {
        var getBonus = function(text,type) {
            switch(type) {
                case 0:
                    text = text.replace(BombaBot.searchKeys[BombaBot.language].energyText,"");
                    break;
                case 1:
                    text = text.replace(BombaBot.searchKeys[BombaBot.language].motivationText,"")
                    break;
                case 2:
                    text = text.replace(BombaBot.searchKeys[BombaBot.language].healthText,"");
                    break;
            }
            text = text.slice(1);
            text = text.replace("%","");
            return parseInt(text);
        }
        var result = Array(3).fill(0);
        for(var i = 0 ; i < bonuses.length;i++) {
            var type = -1;
            if(bonuses[i].includes(BombaBot.searchKeys[BombaBot.language].energyText)) {
                type = 0;
            }else if(bonuses[i].includes(BombaBot.searchKeys[BombaBot.language].motivationText)) {
                type = 1;
            }else if(bonuses[i].includes(BombaBot.searchKeys[BombaBot.language].healthText)) {
                type = 2;
            }
            if(type !=-1)
            result[type] = getBonus(bonuses[i],type);

        }
        return result;
    };
    BombaBot.filterConsumables = function(energy,motivation,health) {
        var result = [];
        for(var i = 0 ; i < BombaBot.allConsumables.length;i++) {
            if(energy && BombaBot.allConsumables[i].energy == 0) {
                continue;
            }
            if(motivation && BombaBot.allConsumables[i].motivation == 0) {
                continue;
            }
            if(health && BombaBot.allConsumables[i].health == 0) {
                continue;
            }
            result.push(BombaBot.allConsumables[i]);
        }
        return result;
    };
    BombaBot.changeConsumableSelection = function(id,selected) {
        for(var i = 0 ; i < BombaBot.allConsumables.length;i++) {
            if(BombaBot.allConsumables[i].id == id) {
                BombaBot.allConsumables[i].setSelected(selected);
                break;
            }
        }
    };
    BombaBot.changeSelectionAllConsumables = function(selected) {
        for(var i = 0 ; i < BombaBot.allConsumables.length;i++) {
            BombaBot.allConsumables[i].setSelected(selected);
        }
    };
    BombaBot.canUseConsume = function(id) {
        return Bag.items_by_id[id] && (BuffList.cooldowns[id] == undefined || BuffList.cooldowns[id].time <= new ServerDate().getTime())
    };
    BombaBot.tryUseEnergyConsumable = async function() {
        if(BombaBot.canUseConsume(BombaBot.settings.energyConsumable)) {
            const consumable = Bag.getItemByItemId(BombaBot.settings.energyConsumable)
            ItemUse.doIt(BombaBot.settings.energyConsumable);
            while(BombaBot.canUseConsume(BombaBot.settings.energyConsumable)) await new Promise(r => setTimeout(r, 10));
            if(!consumable.count) BombaBot.energyConsumable = 'none'
            $(".tw2gui_dialog_framefix").remove();
            return true;
        }
        return false;
    };
    BombaBot.tryUseHealthConsumable = async function() {
        if(BombaBot.canUseConsume(BombaBot.settings.healthConsumable)) {
            const consumable = Bag.getItemByItemId(BombaBot.settings.healthConsumable)
            if(BombaBot.healthSet != -1) {
                BombaBot.equipSet(BombaBot.healthSet);
                await new Promise(r => setTimeout(r, BombaBot.settings.setWearDelay*1000));
            }
            ItemUse.doIt(BombaBot.settings.healthConsumable);
            while(BombaBot.canUseConsume(BombaBot.settings.healthConsumable)) await new Promise(r => setTimeout(r, 10));
            if(!consumable.count) BombaBot.healthConsumable = 'none'
            $(".tw2gui_dialog_framefix").remove();
            return true;
        }
        return false;
    };
    BombaBot.requireEnergyConsumable = async function() {
        BombaBot.currentState = 2;
        while(!await BombaBot.tryUseEnergyConsumable()) await new Promise(r => setTimeout(r, 10));
        BombaBot.currentState = 1;
    };
    BombaBot.requireHealthConsumable = async function() {
        BombaBot.currentState = 2;
        while(!await BombaBot.tryUseHealthConsumable()) await new Promise(r => setTimeout(r, 10));
        BombaBot.currentState = 1;
    };
    BombaBot.requireMotivationConsumable = async function() {
        const consumable = Bag.getItemByItemId(BombaBot.settings.motivationConsumable)
        BombaBot.currentState = 2;
        while(!BombaBot.canUseConsume(BombaBot.settings.motivationConsumable)) await new Promise(r => setTimeout(r, 10));
        ItemUse.doIt(BombaBot.settings.motivationConsumable);
        while(BombaBot.canUseConsume(BombaBot.settings.motivationConsumable)) await new Promise(r => setTimeout(r, 10));
        BombaBot.currentState = 1;
        if(!consumable.count) BombaBot.healthConsumable = 'none'
        $(".tw2gui_dialog_framefix").remove();
    };
    BombaBot.calculateDistances = function() {
        for(var i = 0; i < BombaBot.addedJobs.length;i++) {
            BombaBot.addedJobs[i].calculateDistance();
        }
    };
    BombaBot.createDistanceMatrix = function() {
        var distances = new Array(BombaBot.addedJobs.length);
        for(var i = 0 ; i < distances.length;i++) {
            distances[i] = new Array(BombaBot.addedJobs.length);
        }
        for(var i = 0 ; i < distances.length;i++) {
            for(var j = i; j < distances[i].length;j++) {
                if(i == j) {
                    distances[i][j] = distances[j][i] = Number.MAX_SAFE_INTEGER;
                    continue;
                }
                distances[i][j] = distances[j][i] = Map.calcWayTime({x:BombaBot.addedJobs[i].x,y:BombaBot.addedJobs[i].y},{x:BombaBot.addedJobs[j].x,y:BombaBot.addedJobs[j].y});
            }
        }
        return distances;
    };
    BombaBot.createRoute = function() {
        BombaBot.calculateDistances();
        var closestJobIndex = 0;
        var closestDistance = BombaBot.addedJobs[0].distance;
        var route = [];
        var distances = BombaBot.createDistanceMatrix();
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
        for(var i = 1; i < BombaBot.addedJobs.length;i++) {
            if(BombaBot.addedJobs[i].distance < closestDistance) {
                closestDistance = BombaBot.addedJobs[i].distance;
                closestJobIndex = i;
            }
        }
        route.push(closestJobIndex);
        while(route.length < BombaBot.addedJobs.length) {
            var closestJob = getClosestJob(route[route.length-1],route,distances);
            route.push(closestJob);
        }
        var addedJobsOrder = [];
        for(var i = 0 ; i < route.length;i++) {
            addedJobsOrder.push(BombaBot.addedJobs[route[i]]);
        }
        BombaBot.addedJobs = addedJobsOrder;
        BombaBot.selectTab("choosenJobs");
    };
    BombaBot.equipSet = async function(set) {
        if(set == -1) return true;
        EquipManager.switchEquip(BombaBot.sets[set].equip_manager_id);
        while(true) {
            let finished = await BombaBot.isGearEquiped(BombaBot.getSetItemArray(BombaBot.sets[set]));
            if(finished) break;
            await new Promise(r => setTimeout(r, 1));
        }
        return Promise.resolve(true);
    };
    BombaBot.getSetItemArray = function(set) {
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
    BombaBot.isWearing = function(itemId) {
        if(Wear.wear[ItemManager.get(itemId).type] == undefined) return false;
        return Wear.wear[ItemManager.get(itemId).type].obj.item_id == itemId;
    };
    BombaBot.isGearEquiped = async function(items) {
        for(var i = 0 ; i < items.length;i++) {
            if(!BombaBot.isWearing(items[i]))return false;
        }
        return true;
    }
    BombaBot.getBestGear = function(jobid) {
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
    BombaBot.equipBestGear = async function(jobid) {
        var bestGear = BombaBot.getBestGear(jobid);
        if (bestGear) {
            for(var i = 0 ; i < bestGear.length;i++) {
                if(!BombaBot.isWearing(bestGear[i]))
                Wear.carry(Bag.getItemByItemId(bestGear[i]));
            }
            while(true) {
                let finished = await BombaBot.isGearEquiped(bestGear);
                if(finished) break;
                await new Promise(r => setTimeout(r, 1));
            }
        }
        return Promise.resolve(true);
    };
    BombaBot.checkMotivation = function(index,result,callback) {
        var check = function(index,result) {
            BombaBot.loadJobMotivation(index,function(motivation) {
            result.push(motivation);
             if(index+1 < BombaBot.addedJobs.length ) {
                 check(++index,result);
             }else
             if(index+1 == BombaBot.addedJobs.length) {
                 callback(result);
                 return;
             }
         });
        };
        check(0,result);
    };
    BombaBot.isMotivationAbove = function(result) {
        for(var i = 0 ; i < result.length;i++) {
            if(result[i] > BombaBot.addedJobs[i].stopMotivation) {
                return true;
            }
        }
        return false;
    };
    BombaBot.jobsBelowMotivation = function(result) {
        var count = 0;
        for(var i = 0 ; i < result.length;i++) {
            if(result[i] <= BombaBot.addedJobs[i].stopMotivation) {
                count++;
            }
        }
        return count;
    };
    BombaBot.averageMissingMotivation = function(result) {
        var motivation = 0;
        for(var i = 0 ; i < result.length;i++) {
            motivation += (100-result[i]);
        }
        return motivation/result.length;
    };
    BombaBot.isHealthBelowLimit = function() {
        return BombaBot.settings.healthStop >= Character.health;
    };
    BombaBot.shouldUseHealthConsumable = function() {
        return BombaBot.settings.healthConsumable != 'none' && BombaBot.settings.healthMinimum >= Character.health;
    };
    BombaBot.shouldUseMotivationConsumable = function (motivation) {
        return BombaBot.settings.motivationConsumable != 'none' 
            && BombaBot.jobsBelowMotivation(motivation) == BombaBot.addedJobs.length;
    };
    BombaBot.isStopMotivationZero = function() {
        for(var i = 0 ; i < BombaBot.addedJobs.length;i++) {
            if(BombaBot.addedJobs[i].stopMotivation == 0) {
                return true;
            }
        }
        return false;
    };
    BombaBot.canAddMissing = function(result) {
        if(!BombaBot.settings.addMotivation && BombaBot.jobsBelowMotivation(result) && !BombaBot.isStopMotivationZero()) {
            alert("Sem motivação!");
            return false;
        }
        if(!BombaBot.settings.addEnergy && Character.energy == 0) {
            alert("Sem energia!");
            return false;
        }
        if(!BombaBot.settings.addHealth && BombaBot.isHealthBelowLimit()) {
            alert("Sem saúde!");
            return false;
        }
        return true;
    };
    BombaBot.finishRun = function() {
        BombaBot.currentState = 0;
        BombaBot.isRunning = false;
        BombaBot.selectTab("choosenJobs");
        alert("Finished");
    };
    BombaBot.updateStatistics = function(oldXp) {
        var xpDifference = Character.experience - oldXp;
        BombaBot.statistics.xpInSession += xpDifference;
        BombaBot.statistics.totalXp += xpDifference;
    }
    BombaBot.run = function() {
        BombaBot.checkMotivation(0,[], async function(result) {
            if(!BombaBot.isMotivationAbove(result)) {
                if(BombaBot.settings.motivationConsumable != 'none') {
                    await BombaBot.requireMotivationConsumable()
                } else {
                    return BombaBot.finishRun()
                }
            }
            if(BombaBot.isHealthBelowLimit()) {
                if(BombaBot.settings.healthConsumable != 'none') {
                    await BombaBot.requireHealthConsumable() 
                } else {
                    return BombaBot.finishRun()
                }
            }
            if(!Character.energy) {
                if (BombaBot.settings.energyConsumable) {
                    await BombaBot.requireEnergyConsumable()
                } else if (BombaBot.settings.useGoldOnEnergyDepletion) {
                    return Premium.actionUse('energy', {}, async (response) => {
                        if (response.error) {
                            if(BombaBot.settings.energyConsumable) {
                                await BombaBot.requireEnergyConsumable();
                            }
                            else {
                                BombaBot.finishRun();
                            }
                        } else {
                            BombaBot.run()
                        }
                    })
                } else return BombaBot.finishRun()
            }
            BombaBot.currentState = 1;
            BombaBot.selectTab("choosenJobs");
            BombaBot.prepareJobRun(BombaBot.currentJob.job);
        });
    };
    BombaBot.prepareJobRun = function(index) {
            BombaBot.loadJobMotivation(index,async function(motivation) {
                if(Character.energy <= BombaBot.settings.energyMinimum) {
                    BombaBot.tryUseEnergyConsumable()
                }
                if(Character.energy == 0 || BombaBot.isHealthBelowLimit()) {
                    BombaBot.run();
                }
                else if(motivation <= BombaBot.addedJobs[index].stopMotivation && BombaBot.addedJobs[index].stopMotivation > 0) {
                    BombaBot.changeJob();
                }else
                if(Map.calcWayTime(Character.position,{x:BombaBot.addedJobs[index].x,y:BombaBot.addedJobs[index].y}) == 0) {
                    var maxJobs;
                    (Premium.hasBonus('automation')) ? maxJobs = 9 : maxJobs = 4;
                    if(BombaBot.addedJobs[index].stopMotivation != 0){
                    var numberOfJobs = Math.min(motivation - BombaBot.addedJobs[index].stopMotivation,Character.energy,maxJobs);
                    }else {
                        var numberOfJobs = Math.min(Character.energy,maxJobs);
                    }
                    BombaBot.runJob(index,numberOfJobs);
                }else {
                    var equiped = await BombaBot.equipSet(BombaBot.travelSet);
                    BombaBot.walkToJob(index);
                }
            });
    };
    BombaBot.walkToJob = async function(index) {
        JobWindow.startJob(BombaBot.addedJobs[index].id,BombaBot.addedJobs[index].x,BombaBot.addedJobs[index].y,15);
        while(true) {
            if(Map.calcWayTime(Character.position,{x:BombaBot.addedJobs[index].x,y:BombaBot.addedJobs[index].y}) == 0) {
                break;
            }
            if(!BombaBot.isRunning) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        BombaBot.cancelJobs();
        if(BombaBot.isRunning)
        BombaBot.prepareJobRun(index);
    };
    BombaBot.changeJob = function() {
        (BombaBot.currentJob.direction) ? BombaBot.currentJob.job++ : BombaBot.currentJob.job--;
        if(BombaBot.currentJob.job == BombaBot.addedJobs.length) {
            BombaBot.currentJob.job--;
            BombaBot.currentJob.direction = false;
        } else if(BombaBot.currentJob.job < 0) {
            BombaBot.currentJob.job++;
            BombaBot.currentJob.direction = true;
        }
        BombaBot.setCookies();
        BombaBot.run();
    };
    BombaBot.runJob = async function(jobIndex,jobCount) {
        BombaBot.statistics.jobsInSession += jobCount;
        BombaBot.statistics.totalJobs += jobCount;
        var oldXp = Character.experience;
        await BombaBot.equipBestGear(BombaBot.addedJobs[jobIndex].id);
        for(var i = 0; i < jobCount;i++) {
            JobWindow.startJob(BombaBot.addedJobs[jobIndex].id,BombaBot.addedJobs[jobIndex].x,BombaBot.addedJobs[jobIndex].y,15);
        }
        await new Promise(r => setTimeout(r, BombaBot.settings.setWearDelay * 1000));
        BombaBot.equipSet(BombaBot.addedJobs[jobIndex].set);
        while(true) {
            if(BombaBot.shouldUseHealthConsumable()) {
                BombaBot.tryUseHealthConsumable()
            }
            if(TaskQueue.queue.length == 0) {
                BombaBot.updateStatistics(oldXp);
                BombaBot.setCookies();
                BombaBot.prepareJobRun(jobIndex);
                return;
            }
            if(!BombaBot.isRunning || BombaBot.isHealthBelowLimit()) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        BombaBot.statistics.jobsInSession -= TaskQueue.queue.length;
        BombaBot.statistics.totalJobs -= TaskQueue.queue.length;
        BombaBot.updateStatistics(oldXp);
        BombaBot.setCookies();
        BombaBot.cancelJobs();

    };
    BombaBot.cancelJobs = function() {
        if(TaskQueue.queue.length > 0)
            TaskQueue.cancelAll();
    };
    BombaBot.setCookies = function() {
        var expiracyDateTemporary = new Date();
        var hour = expiracyDateTemporary.getHours();
        expiracyDateTemporary.setHours(2,0,0);
        if(hour > 2)
            expiracyDateTemporary.setDate(expiracyDateTemporary.getDate() + 1);
        var temporaryObject ={
            addedJobs:BombaBot.addedJobs,
            travelSet:BombaBot.travelSet,
            jobSet:BombaBot.jobSet,
            healthSet:BombaBot.healthSet,
            currentJob:BombaBot.currentJob
        };
        var expiracyDatePernament = new Date();
        expiracyDatePernament.setDate(expiracyDatePernament.getDate() + 360000);
        var pernamentObject = {
            settings:BombaBot.settings,
            totalJobs:BombaBot.statistics.totalJobs,
            totalXp:BombaBot.statistics.totalXp
        };
        var jsonTemporary = JSON.stringify(temporaryObject);
        var jsonPernament = JSON.stringify(pernamentObject);
        document.cookie = "dobby2temporary=" + jsonTemporary + ";expires=" + expiracyDateTemporary.toGMTString() + ";";
        document.cookie = "dobby2pernament=" + jsonPernament + ";expires=" + expiracyDatePernament.toGMTString() + ";";
    };
    BombaBot.getCookies = function() {
        var cookie = document.cookie.split("=");
        for(var i = 0; i < cookie.length;i++) {
            if(cookie[i].includes("dobby2temporary")) {
                var obj = cookie[i+1].split(";");
                var tempObject = JSON.parse(obj[0]);
                var tmpAddedJobs = tempObject.addedJobs;
                for(var j = 0 ; j < tmpAddedJobs.length;j++) {
                    var jobP = new JobPrototype(tmpAddedJobs[j].x,tmpAddedJobs[j].y,tmpAddedJobs[j].id);
                    jobP.setSilver(tmpAddedJobs[j].silver);
                    jobP.distance = tmpAddedJobs[j].distance;
                    jobP.setExperience(tmpAddedJobs[j].experience);
                    jobP.setMoney(tmpAddedJobs[j].money);
                    jobP.setMotivation(tmpAddedJobs[j].motivation);
                    jobP.setStopMotivation(tmpAddedJobs[j].stopMotivation);
                    jobP.setSet(tmpAddedJobs[j].set);
                    BombaBot.addedJobs.push(jobP);
                }
                BombaBot.travelSet = tempObject.travelSet;
                BombaBot.jobSet = tempObject.jobSet;
                BombaBot.healthSet = tempObject.healthSet;
                BombaBot.currentJob = tempObject.currentJob;
                BombaBot.setSetForAllJobs();
            }
            if(cookie[i].includes("dobby2pernament")) {
                var obj = cookie[i+1].split(";");
                var pernamentObject = JSON.parse(obj[0]);
                BombaBot.settings = { ...BombaBot.settings, ...pernamentObject.settings};
                BombaBot.statistics.totalJobs = pernamentObject.totalJobs;
                BombaBot.statistics.totalXp = pernamentObject.totalXp;
            }
        }
    };
    BombaBot.createWindow = function() {
        var window = wman.open("dobby").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("BOMBA PATCH");
        var content = $('<div class=\'dobby2window\'/>');
        var tabs = {
            "jobs":"Trabalhos",
            "choosenJobs":"Trabalhos selecionados",
            "sets":"Conjuntos",
            "consumables":"Consumíveis",
            "stats":"Estatísticas",
            "settings":"Configurações"
        };
        var tabLogic = function(win,id) {
            var content = $('<div class=\'dobby2window\'/>');
            switch(id) {
                case "jobs":
                    BombaBot.loadJobData(function(){
                    BombaBot.removeActiveTab(this);
                    BombaBot.removeWindowContent();
                    BombaBot.addActiveTab("jobs",this);
                    content.append(BombaBot.createJobsTab());
                    BombaBot.window.appendToContentPane(content);
                    BombaBot.addJobTableCss();
                    $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({"top":BombaBot.jobTablePosition.content});
                    $(".dobby2window .tw2gui_scrollbar_pulley").css({"top":BombaBot.jobTablePosition.scrollbar});
                    BombaBot.addEventsHeader();
                    });
                    break;
                case "choosenJobs":
                    BombaBot.removeActiveTab(this);
                    BombaBot.removeWindowContent();
                    BombaBot.addActiveTab("choosenJobs",this);
                    content.append(BombaBot.createAddedJobsTab());
                    BombaBot.window.appendToContentPane(content);
                    $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({"top":BombaBot.addedJobTablePosition.content});
                    $(".dobby2window .tw2gui_scrollbar_pulley").css({"top":BombaBot.addedJobTablePosition.scrollbar});
                    BombaBot.addAddedJobsTableCss();
                    break;
                case "consumables":
                    BombaBot.removeActiveTab(this);
                    BombaBot.removeWindowContent();
                    BombaBot.addActiveTab("consumables",this);
                    BombaBot.findAllConsumables();
                    content.append(BombaBot.createConsumablesMenu());
                    BombaBot.window.appendToContentPane(content);
                    $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({"top":BombaBot.consumableTablePosition.content});
                    $(".dobby2window .tw2gui_scrollbar_pulley").css({"top":BombaBot.consumableTablePosition.scrollbar});
                    BombaBot.addConsumableMenuCss();
                    break;
                case "sets":
                    BombaBot.loadSets(function() {
                        BombaBot.removeActiveTab(this);
                        BombaBot.removeWindowContent();
                        BombaBot.addActiveTab("sets",this);
                        content.append(BombaBot.createSetGui())
                        BombaBot.window.appendToContentPane(content);
                    });
                    break;
                case "stats":
                    BombaBot.removeActiveTab(this);
                    BombaBot.removeWindowContent();
                    BombaBot.addActiveTab("stats",this);
                    content.append(BombaBot.createStatisticsGui());
                    BombaBot.window.appendToContentPane(content);
                    break;
                case "settings":
                    BombaBot.removeActiveTab(this);
                    BombaBot.removeWindowContent();
                    BombaBot.addActiveTab("settings",this);
                    content.append(BombaBot.createSettingsGui());
                    BombaBot.window.appendToContentPane(content);
                    break;
            }
        }
        for(var tab in tabs) {
            window.addTab(tabs[tab],tab,tabLogic);
        }
        BombaBot.window = window;
        BombaBot.selectTab("jobs");
    };
    BombaBot.selectTab = function(key) {
        BombaBot.window.tabIds[key].f(BombaBot.window,key);
    };
    BombaBot.removeActiveTab = function(window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };
    BombaBot.addActiveTab = function(key,window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };
    BombaBot.removeWindowContent = function() {
        $(".dobby2window").remove();
    };
    BombaBot.addJobTableCss = function() {
        $(".dobby2window .jobIcon").css({"width":"80px"});
        $(".dobby2window .jobName").css({"width":"150px"});
        $(".dobby2window .jobXp").css({"width":"40px"});
        $(".dobby2window .jobMoney").css({"width":"40px"});
        $(".dobby2window .jobMotivation").css({"width":"40px"});
        $(".dobby2window .jobDistance").css({"width":"100px"});
        $(".dobby2window .row").css({"height":"60px"});
        $('.dobby2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    BombaBot.addAddedJobsTableCss = function() {
        $(".dobby2window .jobIcon").css({"width":"80px"});
        $(".dobby2window .jobName").css({"width":"130px"});
        $(".dobby2window .jobStopMotivation").css({"width":"110px"});
        $(".dobby2window .jobRemove").css({"width":"105px"});
        $(".dobby2window .jobSet").css({"width":"100px"});
        $(".dobby2window .row").css({"height":"60px"});
        $('.dobby2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    BombaBot.addConsumableMenuCss = function() {
        $(".dobby2window #consumables-menus").css({"display":"flex","justify-content":"space-evenly"});
        $(".dobby2window .consumable-menu").css({
            "display": "flex",
            "flex-flow": "column",
            "align-items": "center",
            "width": "100%",
            "overflow-y": "auto"
        });
        $(".dobby2window .consumable-menu > h3").css('margin-bottom', '60px')
        $(".dobby2window .consumable-menu > span").css('margin-bottom', '20px')
        $(".dobby2window .consumable-menu > div.tw2gui_checkbox").css('margin-bottom', '20px')
        $(".dobby2window #energy-consumable-menu > h3").css('margin-bottom', '20px')
        $("#energy-consumable-menu").css({
            'border-right': '2px solid black',
            'border-left': '2px solid black'
        })
    };
    BombaBot.addEventsHeader = function() {
        $(".dobby2window .jobXp").click(function() {
            if(BombaBot.sortJobTableXp == 0) {
                BombaBot.sortJobTableXp = 1;
            }else {
                (BombaBot.sortJobTableXp == 1) ? BombaBot.sortJobTableXp = -1 : BombaBot.sortJobTableXp = 1;
            }
            BombaBot.sortJobTableDistance = 0;
            BombaBot.selectTab("jobs");
        });
        $(".dobby2window .jobDistance").click(function() {
            if(BombaBot.sortJobTableDistance == 0) {
                BombaBot.sortJobTableDistance = 1;
            }else {
                (BombaBot.sortJobTableDistance == 1) ? BombaBot.sortJobTableDistance = -1 : BombaBot.sortJobTableDistance = 1;
            }
            BombaBot.sortJobTableXp = 0;
            BombaBot.selectTab("jobs");
        });
    };
    BombaBot.createJobsTab = function() {
        var htmlSkel = $("<div id = \'jobs_overview'\></div>");
        var html = $("<div class = \'jobs_search'\ style=\'position:relative;'\><div id=\'jobFilter'\style=\'position:absolute;top:10px;left:15px'\></div><div id=\'job_only_silver'\style=\'position:absolute;top:10px;left:200px;'\></div><div id=\'job_no_silver'\style=\'position:absolute;top:10px;left:270px;'\></div><div id=\'job_center'\style=\'position:absolute;top:10px;left:350px;'\></div><div id=\'button_filter_jobs'\style=\'position:absolute;top:5px;left:450px;'\></div></div>");
        var table = new west.gui.Table();
        var xpIcon = '<img src="/images/icons/star.png">';
        var dollarIcon = '<img src="/images/icons/dollar.png">';
        var motivationIcon = '<img src="/images/icons/motivation.png">';
        var arrow_desc = '&nbsp;<img src="../images/window/jobs/sortarrow_desc.png"/>';
        var arrow_asc = '&nbsp;<img src="../images/window/jobs/sortarrow_asc.png"/>';
        var uniqueJobs = BombaBot.getAllUniqueJobs();
        table.addColumn("jobIcon","jobIcon").addColumn("jobName","jobName").addColumn("jobXp","jobXp").addColumn("jobMoney","jobMoney").addColumn("jobMotivation","jobMotivation").addColumn("jobDistance","jobDistance").addColumn("jobAdd","jobAdd");
        table.appendToCell("head","jobIcon","Ícone").appendToCell("head","jobName","Trabalho").appendToCell("head","jobXp",xpIcon + (BombaBot.sortJobTableXp == 1 ? arrow_asc : BombaBot.sortJobTableXp == -1 ? arrow_desc : "")).appendToCell("head","jobMoney",dollarIcon).appendToCell("head","jobMotivation",motivationIcon).appendToCell("head","jobDistance","Distância " + (BombaBot.sortJobTableDistance == 1 ? arrow_asc : BombaBot.sortJobTableDistance == -1 ? arrow_desc : "")).appendToCell("head","jobAdd","");
        for(var job = 0 ; job < uniqueJobs.length;job++) {
            table.appendRow().appendToCell(-1,"jobIcon",BombaBot.getJobIcon(uniqueJobs[job].silver,uniqueJobs[job].id,uniqueJobs[job].x,uniqueJobs[job].y)).appendToCell(-1,"jobName",BombaBot.getJobName(uniqueJobs[job].id)).appendToCell(-1,"jobXp",uniqueJobs[job].experience).appendToCell(-1,"jobMoney",uniqueJobs[job].money).appendToCell(-1,"jobMotivation",uniqueJobs[job].motivation).appendToCell(-1,"jobDistance",uniqueJobs[job].distance.formatDuration()).appendToCell(-1,"jobAdd",BombaBot.createAddJobButton(uniqueJobs[job].x,uniqueJobs[job].y,uniqueJobs[job].id));
        }
        var textfield = new west.gui.Textfield("jobsearch").setPlaceholder("Procurar trabalho");
        if(BombaBot.jobFilter.filterJob != "") {
            textfield.setValue(BombaBot.jobFilter.filterJob);
        }
        var checkboxOnlySilver = new west.gui.Checkbox();
        checkboxOnlySilver.setLabel("Prata");
        checkboxOnlySilver.setSelected(BombaBot.jobFilter.filterOnlySilver);
        checkboxOnlySilver.setCallback(function() {
            if(this.isSelected()) {
                BombaBot.jobFilter.filterOnlySilver = true;
              }else {
                BombaBot.jobFilter.filterOnlySilver = false;
              }
        });
        var checkboxNoSilver = new west.gui.Checkbox();
        checkboxNoSilver.setLabel("S/ prata");
        checkboxNoSilver.setSelected(BombaBot.jobFilter.filterNoSilver);
        checkboxNoSilver.setCallback(function() {
            if(this.isSelected()) {
                BombaBot.jobFilter.filterNoSilver = true;
              }else {
                BombaBot.jobFilter.filterNoSilver = false;
              }
        });
        var checkboxCenterJobs = new west.gui.Checkbox();
        checkboxCenterJobs.setLabel("Centro mapa");
        checkboxCenterJobs.setSelected(BombaBot.jobFilter.filterCenterJobs);
        checkboxCenterJobs.setCallback(function() {
            if(this.isSelected()) {
                BombaBot.jobFilter.filterCenterJobs = true;
              }else {
                BombaBot.jobFilter.filterCenterJobs = false;
              }
        });
        var buttonFilter = new west.gui.Button("Filtrar",function() {
            BombaBot.jobFilter.filterJob = textfield.getValue();
            BombaBot.jobTablePosition.content = "0px";
            BombaBot.jobTablePosition.scrollbar = "0px";
            BombaBot.selectTab("jobs");
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
    BombaBot.createAddJobButton = function(x,y,id) {
        var buttonAdd = new west.gui.Button("Adicionar",function() {
            BombaBot.addJob(x,y,id);
            BombaBot.jobTablePosition.content = $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            BombaBot.jobTablePosition.scrollbar = $(".dobby2window .tw2gui_scrollbar_pulley").css("top");
            BombaBot.selectTab("jobs");
        });
        buttonAdd.setWidth(100);
        return buttonAdd.getMainDiv();
    };
    BombaBot.createAddedJobsTab = function() {
        var htmlSkel = $("<div id=\'added_jobs_overview'\></div>");
        var footerHtml = $("<div id=\'start_dobby2'\ style=\'position:relative;'\><span class =\'dobby_state'\ style=\' position:absolute;left:20px; top:10px; font-family: Arial, Helvetica, sans-serif; font-size: 15px;font-weight: bold;'\> Status:"+ BombaBot.states[BombaBot.currentState] +"</span><div class = \'dobby_run'\ style = \'position:absolute; left:350px; top:20px;'\></div></div>");
        var table = new west.gui.Table();
        table.addColumn("jobIcon","jobIcon").addColumn("jobName","jobName").addColumn("jobStopMotivation","jobStopMotivation").addColumn("jobSet","jobSet").addColumn("jobRemove","jobRemove");
        table.appendToCell("head","jobIcon","ícone").appendToCell("head","jobName","nome trabalho").appendToCell("head","jobStopMotivation","Parar motivação").appendToCell("head","jobSet","Conjunto de trabalho").appendToCell("head","jobRemove","");
        for(var job = 0; job < BombaBot.addedJobs.length;job++) {
            table.appendRow().appendToCell(-1,"jobIcon",BombaBot.getJobIcon(BombaBot.addedJobs[job].silver,BombaBot.addedJobs[job].id,BombaBot.addedJobs[job].x,BombaBot.addedJobs[job].y)).appendToCell(-1,"jobName",BombaBot.getJobName(BombaBot.addedJobs[job].id)).appendToCell(-1,"jobStopMotivation",BombaBot.createMinMotivationTextfield(BombaBot.addedJobs[job].x,BombaBot.addedJobs[job].y,BombaBot.addedJobs[job].id,BombaBot.addedJobs[job].stopMotivation)).appendToCell(-1,"jobSet",BombaBot.createComboxJobSets(BombaBot.addedJobs[job].x,BombaBot.addedJobs[job].y,BombaBot.addedJobs[job].id)).appendToCell(-1,"jobRemove",BombaBot.createRemoveJobButton(BombaBot.addedJobs[job].x,BombaBot.addedJobs[job].y,BombaBot.addedJobs[job].id));
        }
        var buttonStart = new west.gui.Button("Começar",function() {
            var parseSuccesfull = BombaBot.parseStopMotivation();
            if(parseSuccesfull) {
                BombaBot.createRoute();
                BombaBot.isRunning = true;
                BombaBot.setCookies();
                BombaBot.run();
            }else {
                new UserMessage("Formato incorreto de conjunto, parada de motivação", UserMessage.TYPE_ERROR).show();
            }
        });
        var buttonStop = new west.gui.Button("Parar",function() {
            BombaBot.isRunning = false;
            BombaBot.currentState = 0;
            BombaBot.selectTab("choosenJobs");
        });
        htmlSkel.append(table.getMainDiv());
        $(".dobby_run",footerHtml).append(buttonStart.getMainDiv());
        $(".dobby_run",footerHtml).append(buttonStop.getMainDiv());
        htmlSkel.append(footerHtml);
        return htmlSkel;
    };
    BombaBot.createMinMotivationTextfield = function(x,y,id,placeholder) {
        var componentId = "x-" + x + "y-" +y + "id-" + id;
        var textfield = new west.gui.Textfield();
        textfield.setId(componentId);
        textfield.setWidth(40);
        textfield.setValue(placeholder);
        return textfield.getMainDiv();
    };
    BombaBot.createRemoveJobButton = function(x,y,id) {
        var buttonRemove = new west.gui.Button("Remover",function() {
            BombaBot.removeJob(x,y,id);
            BombaBot.addedJobTablePosition.content = $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            BombaBot.addedJobTablePosition.scrollbar = $(".dobby2window .tw2gui_scrollbar_pulley").css("top");
            BombaBot.selectTab("choosenJobs");
        });
        buttonRemove.setWidth(100);
        return buttonRemove.getMainDiv();
    };
    BombaBot.createComboxJobSets = function(x,y,id) {
        var combobox = new west.gui.Combobox();
        BombaBot.addComboboxItems(combobox);
        combobox = combobox.select(BombaBot.getJobSet(x,y,id));
        combobox.setWidth(60);
        combobox.addListener(function(value) {
            BombaBot.setJobSet(x,y,id,value);;
            BombaBot.selectTab("choosenJobs");
        });
        return combobox.getMainDiv();
    };
    BombaBot.addComboboxItems = function(combobox) {
        combobox.addItem(-1,"Nenhum");
        for(var i = 0 ; i < BombaBot.sets.length;i++) {
            combobox.addItem(i.toString(),BombaBot.sets[i].name);
        }
    };
    BombaBot.createSetGui = function() {
        if(BombaBot.sets.length == 0) {
            return $("<span style=\'font-size:20px'\>Conjuntos indisponíveis</span>");
        }
        var htmlSkel = $("<div id =\'dobby2_sets_window'\ style=\'display:block;position:relative;width:650px;height:430px;'\><div id=\'dobby2_sets_left' style=\'display:block;position:absolute;width:250px;height:430px;top:0px;left:0px'\></div><div id=\'dobby2_sets_right' style=\'display:block;position:absolute;width:300px;height:410px;top:0px;left:325px'\></div></div>");
        var combobox = new west.gui.Combobox("combobox_sets");
        BombaBot.addComboboxItems(combobox);
        combobox = combobox.select(BombaBot.selectedSet);
        combobox.addListener(function(value) {
            BombaBot.selectedSet = value;
            BombaBot.selectTab("sets");
        });
        var buttonSelectTravelSet = new west.gui.Button("selecionar conjunto de velocidade",function() {
            BombaBot.travelSet = BombaBot.selectedSet;
            BombaBot.selectTab("sets");
        });
        var buttonSelectJobSet = new west.gui.Button("Selecionar conjunto de trabalho",function() {
            BombaBot.jobSet = BombaBot.selectedSet;
            BombaBot.setSetForAllJobs();
            BombaBot.selectTab("sets");
        });
        var buttonSelectHealthSet = new west.gui.Button("Selecionar conjunto de saúde",function() {
            BombaBot.healthSet = BombaBot.selectedSet;
            BombaBot.selectTab("sets");
        });
        var travelSetText = "Nenhum";
        if(BombaBot.travelSet != -1) {
            travelSetText = BombaBot.sets[BombaBot.travelSet].name;
        }
        var jobSetText = "Nenhum";
        if(BombaBot.jobSet != -1) {
            jobSetText = BombaBot.sets[BombaBot.jobSet].name;
        }
        var healthSetText = "Nenhum";
        if(BombaBot.healthSet != -1) {
            healthSetText = BombaBot.sets[BombaBot.healthSet].name;
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
        if(BombaBot.selectedSet != -1)
        BombaBot.insertSetImages(right,keys);
        $("#dobby2_sets_left",htmlSkel).append(left);
        $("#dobby2_sets_right",htmlSkel).append(right);
        return htmlSkel;
    };
    BombaBot.getImageSkel = function() {
        return $("<img src=\''\>");
    };
    BombaBot.insertSetImages = function(html,keys) {
        for(var i = 0 ; i < keys.length;i++) {
            if(BombaBot.sets[BombaBot.selectedSet][keys[i]] != null) {
            $(".wear_"+keys[i],html).append(BombaBot.getImageSkel().attr("src",BombaBot.getItemImage(BombaBot.sets[BombaBot.selectedSet][keys[i]])));
            }
        }
        return html;
    };
    BombaBot.createConsumablesMenu = function() {
        const menuWrapper = $('<div id="consumables-menus"/>');
        const motivationConsumableMenu = $('<div id="motivation-consumable-menu" class="consumable-menu motivation">');
        $(motivationConsumableMenu).append(
            $('<h3>').text('Motivação').css('text-align', 'center'),
            BombaBot.createConsumableSelect('motivation').getMainDiv(),
            BombaBot.createConsumableCard(Bag.getItemByItemId(BombaBot.settings.motivationConsumable), 'motivation'),
        );
        const energyConsumableMenu = $('<div id="energy-consumable-menu" class="consumable-menu energy">');
        $(energyConsumableMenu).append(
            $('<h3>').text('Energia').css('text-align', 'center'),
            BombaBot.createCheckbox('useGoldOnEnergyDepletion', '18 pepitas')
                .setCallback(() => BombaBot.setCookies())
                .getMainDiv(),
            BombaBot.createConsumableSelect('energy')
                .addListener(() => BombaBot.setCookies())
                .getMainDiv(),
            BombaBot.createConsumableCard(Bag.getItemByItemId(BombaBot.settings.energyConsumable), 'energy'),
            $('<label for="energyMinimum">').text('Usar em valor'),
            BombaBot.createTextfield('energyMinimum')
                .blur(() => BombaBot.setCookies())
                .getMainDiv()
        );
        const healthConsumableMenu = $('<div id="health-consumable-menu" class="consumable-menu health">');
        $(healthConsumableMenu).append(
            $('<h3>').text('Saúde').css('text-align', 'center'),
            BombaBot.createConsumableSelect('health')
                .addListener(() => BombaBot.setCookies())
                .getMainDiv(),
            BombaBot.createConsumableCard(Bag.getItemByItemId(BombaBot.settings.healthConsumable), 'health'),
            $('<label for="healthMinimum">').text('Usar em valor'),
            BombaBot.createTextfield('healthMinimum')
                .blur(() => BombaBot.setCookies())
                .getMainDiv()
        );
        return $(menuWrapper).append(
            motivationConsumableMenu,
            energyConsumableMenu,
            healthConsumableMenu
        )
    }
    BombaBot.createCheckbox = function(key, label) {
        const checkbox = new west.gui.Checkbox();
        checkbox.setLabel(label);
        checkbox.setSelected(BombaBot.settings[key]);
        checkbox.setCallback(function() {
            BombaBot.settings[key] = !BombaBot.settings[key];
        });
        return checkbox
    };
    BombaBot.createConsumableSelect = function(type) {
        const consumables = Bag.search(BombaBot.searchKeys[BombaBot.language][type])
            .reduce((acc, {obj: {item_id, name}}) => (acc[item_id] = name, acc), {none: 'Nenhum'});
        const select = BombaBot.createSelect(`${type}Consumable`, consumables);
        select.addListener(value => {
            const card = BombaBot.createConsumableCard(Bag.getItemByItemId(value), type)
            $(`#selected-${type}-consumable-card`).replaceWith(card)
        })
        return select
    };
    BombaBot.createConsumableCard = function(consumable, type) {
        const consumableCardCss = {
            display: 'flex',
            flexFlow: 'column',
            marginBottom: '30px'
        };
        const consumableCountCss = { marginBottom: '10px' };
        const consumableBonusCSS = {};
        const card = $(`<div id="selected-${type}-consumable-card"/>`)
            .css(consumableCardCss)
            .append(BombaBot.createConsumableIcon(consumable, type));
        if (consumable) {
            card.append(
                $('<span/>').css(consumableCountCss).text('Quantidade: ' + consumable.count),
                ...consumable.obj.usebonus.map(bonus => $('<span/>').css(consumableBonusCSS).text(bonus))
            );
        }
        return card;
    };
    BombaBot.createConsumableIcon = function(consumable, type) {
        const icon = consumable 
            ? $(`<img id="selected-${type}-consumable-icon">`).attr('src', consumable.obj.image)
            : $(`<div id="selected-${type}-consumable-icon">`).css({'height': '80px'});
        icon.css({'width': '80px', 'margin': 'auto', 'margin-bottom': '15px'})
        return icon
    };
    BombaBot.createTextfield = function(key, label, width = 100) {
        var textfield = new west.gui.Textfield();
        if (label) textfield.setLabel(label);
        textfield.setValue(BombaBot.settings[key]);
        textfield.setWidth(width);
        textfield.blur(({ target: { value } }) => BombaBot.settings[key] = value)
        return textfield;
    };
    BombaBot.getConsumableById = function (id) {
        return BombaBot.allConsumables.find(c => c.id == id);
    };
    BombaBot.createSelect = function(key, items) {
        const select = new west.gui.Combobox(`BombaBot.${key}`);
        for(let itemId in items) select.addItem(itemId, items[itemId]);
        select.select(BombaBot.settings[key]);
        select.addListener(value => BombaBot.settings[key] = value);
        return select;
    };
    BombaBot.createSettingsGui = function() {
        var htmlSkel = $("<div id=\'settings_overview'\ style = \'padding:10px;'\></div>");
        var htmlHealthStop = $("<div></div>");
        htmlHealthStop.append("<span> Parar jobs quando a saúde atingir o valor X ou menos</span>");
        var healthStopTextfiled = new west.gui.Textfield("healthStop");
        healthStopTextfiled.setValue(BombaBot.settings.healthStop);
        healthStopTextfiled.setWidth(100);
        htmlHealthStop.append(healthStopTextfiled.getMainDiv());
        var htmlSetWearDelay = $("<div></div>");
        htmlSetWearDelay.append("<span> Delay para equipar conjunto de trabalho </span>");
        var setWearDelayTextfiled = new west.gui.Textfield("setWearDelay");
        setWearDelayTextfiled.setValue(BombaBot.settings.setWearDelay);
        setWearDelayTextfiled.setWidth(100);
        htmlSetWearDelay.append(setWearDelayTextfiled.getMainDiv());
        var buttonApply = new west.gui.Button("Aplicar",function() {
           if(BombaBot.isNumber(healthStopTextfiled.getValue())) {
                var healthStop = parseInt(healthStopTextfiled.getValue());
                healthStop = Math.max(0, healthStop);
                BombaBot.settings.healthStop = healthStop;
            }
            if(BombaBot.isNumber(setWearDelayTextfiled.getValue())) {
                var setWearDelay = parseInt(setWearDelayTextfiled.getValue());
                setWearDelay = Math.min(10,setWearDelay);
                BombaBot.settings.setWearDelay = setWearDelay;
            }
            BombaBot.setCookies()
            BombaBot.selectTab("settings");
        })

        htmlSkel.append(htmlHealthStop);
        htmlSkel.append("<br>");
        htmlSkel.append(htmlSetWearDelay);
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        return htmlSkel;
    };
    BombaBot.createStatisticsGui = function() {
        var htmlSkel = $("<div id=\'statistics_overview'\></div>");
        htmlSkel.append($("<span>Contagem de trabalho nesta sessão " + BombaBot.statistics.jobsInSession + "</span><br>"));
        htmlSkel.append($("<span>Contagem de experiência nesta sessão " + BombaBot.statistics.xpInSession + "</span><br>"));
        htmlSkel.append($("<span>Contagem de trabalho total " + BombaBot.statistics.totalJobs + "</span><br>"));
        htmlSkel.append($("<span>Contagem de experiência total " + BombaBot.statistics.totalXp + "</span><br>"));
        return htmlSkel;
    };
    BombaBot.createMenuIcon = function() {
        var menuimage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/wAALCAAZABkBAREA/8QAGwAAAQQDAAAAAAAAAAAAAAAAAAYHCAkBAgX/xAApEAABAwQCAgECBwAAAAAAAAABAgMEBQYHEQASCCETIjEJFiMyUVJj/9oACAEBAAA/AK1ottXHNoky5YVv1ORSKetDcyoNQ3FxY61kBCXHQnogqKkgAkEkjX34Vu2rjtmQzEuS36nSX5MdEplqfDcjrcYWSEupS4ASglKtKA0dHX25ziCPRGuY5Yd49Y/unI/4cC7Jx/QpdeqFazDDFTjwUfIuNFSuKVOugftQkNtqKj6AOz6G+Ppnu1MZZDu/ydy9WsOwsp1PHEOgW3Qqe4ZKwmQlj5JKEiOoL+lcoFfXSgGlDsn2eRL84/GeHSryg13CWJHqLGptg025b9pFM2uLbsp75T9YWrbe0NL2n/Ptr2dwy0f4PFbYeXsq4tTOTjXJFy2qmppSmamj1N2KJATvr3CCASNnR+42dHjo458vrzxX4/3RiCy0VWm3FdNzs3E/d8WsuMy2A2Gf00JSnspSyyrstTnsOKBB2eNkvMuW3RdIeyXcrv53SlFylypOLNYSkEJEkqJLoAUoAH0AdD1xH91f2PNeHDhz/9k=';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=BombaBot.loadJobs(); title="BOMBA PATCH" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };
    $(document).ready(function() {
        try{
            BombaBot.loadLanguage();
            BombaBot.loadSets(function(){});
            BombaBot.getCookies();
            BombaBot.createMenuIcon();
        }catch(e) {
            console.log("ocorreu exceção");
        }
    });
})();