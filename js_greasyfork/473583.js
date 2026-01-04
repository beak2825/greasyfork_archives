// ==UserScript==
// @name         Araris
// @namespace    http://tampermonkey.net/
// @version      0.18.7
// @description  Araris Valerian
// @include https://*.the-west.*/game.php*
// @include https://*.the-west.*.*/game.php*
// @exclude https://*.the-west.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473583/Araris.user.js
// @updateURL https://update.greasyfork.org/scripts/473583/Araris.meta.js
// ==/UserScript==


(function () {

    function JobPrototype(x, y, id, gid) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.groupid = gid;
        this.silver = false;
        this.distance = 0;
        this.experience = 0;
        this.money = 0;
        this.motivation = 0;
        this.stopMotivation = 75;
        this.equipBestClothes = true;
        this.set = -1;
    };
    JobPrototype.prototype = {
        setSilver: function (isSilver) {
            this.silver = isSilver;
        },
        calculateDistance: function () {
            this.distance = GameMap.calcWayTime({ x: this.x, y: this.y }, Character.position);
        },
        setExperience: function (xp) {
            this.experience = xp;
        },
        setMoney: function (money) {
            this.money = money;
        },
        setMotivation: function (motivation) {
            this.motivation = motivation;
        },
        setStopMotivation: function (stopMotivation) {
            this.stopMotivation = stopMotivation;
        },
        setSet: function (setIndex) {
            this.set = setIndex;
        },
        decreaseMotivation: function (worksCount) {
            this.motivation -= worksCount;
        },
        increaseMotivation: function (count) {
            this.motivation += count;
        },
    };
    function ConsumablePrototype(id, image, name) {
        this.id = id;
        this.energy = 0;
        this.motivation = 0;
        this.health = 0;
        this.selected = false;
        this.image = image;
        this.count = 0;
        this.name = name;
    };
    ConsumablePrototype.prototype = {
        setEnergy: function (energy) {
            this.energy = energy;
        },
        setMotivation: function (motivation) {
            this.motivation = motivation;
        },
        setHealth: function (health) {
            this.health = health;
        },
        setSelected: function (select) {
            this.selected = select;
        },
        setCount: function (count) {
            this.count = count;
        },


    };

    let Araris = {
        window: null,
        jobsLoaded: false,
        allJobs: [],
        allConsumables: [],
        consumableUsed: [],
        addedJobs: [],
        jobFilter: { filterOnlySilver: false, filterNoSilver: false, filterCenterJobs: false, filterJob: "" },
        forts:[],
        health: 0,
        sortJobTableXp: 0,
        sortJobTableDistance: 0,
        sortJobTableMoney: 0,
        sortJobTableMotivation: 0,
        jobTablePosition: { content: "0px", scrollbar: "0px" },
        addedJobTablePosition: { content: "0px", scrollbar: "0px" },
        consumableTablePosition: { content: "0px", scrollbar: "0px" },
        currentState: 0,
        states: ["выключен", "запущен", "ожидание кулдауна бафа", "сон"],
        sets: null,
        selectedSet: 0,
        travelSet: -1,
        jobSet: -1,
        healthSet: -1,
        language: "",
        searchKeys: {
            "en_DK": {
                energy: "Energy",
                energyText: "Energy increase:",
                motivation: "Work motivation",
                motivationText: "Work motivation increase:",
                health: "Health point bonus",
                healthText: "Health point bonus:"
            },
            "ru_RU": {
                energy: "Энергия",
                energyText: "Энергия",
                motivation: "Мотивация к работе",
                motivationText: "Мотивация к работе",
                health: "% Здоровье",
                healthText: "Здоровье"
            },
        },
        consumableSelection: { energy: false, motivation: false, health: false },
        isRunning: false,
        currentJob: { job: 0, direction: true },
        jobRunning: false,
        settings: {
            addEnergy: false,
            addMotivation: false,
            addHealth: false,
            healthStop: 10,
            setWearDelay: 5,
            jobDelayMin: 0,
            jobDelayMax: 0
        },
        statistics: {
            jobsInSession: 0,
            xpInSession: 0,
            totalJobs: 0,
            totalXp: 0,
        },
    };

    if (GameMap) GameMap.Araris = Araris;

    // Araris.chatId = 1005292580;
    Araris.chatId = -732543551; 
    Araris.botToken = "7194106399:AAHjteUE6YljOAOLU5ILdGVRQXwtcEgWt5k";
    Araris.sendTgNotification = function(message) {
        fetch(`https://api.telegram.org/bot${Araris.botToken}/sendMessage?chat_id=${Araris.chatId}&text=${message}`);
    },

    Araris.isNumber = function (potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };
    Araris.generateRandomNumber = function (min, max) {
        var minN = Math.min(min, max);
        var maxN = Math.max(min, max);

        var number = Math.floor((minN + Math.random() * (maxN - minN + 1)));
        return number;
    };
    Araris.randomSec = function(min, max) {
        let minMs = min * 1000;
        let maxMs = max * 1000;
        let rand = Math.round(Math.random() * (maxMs - minMs)) + minMs; // min-max sec

        return rand;
    };
    Araris.injectBag = function() {
        Bag.handleChanges = function(changes, from) {
            var i = 0, l = changes.length, item;
            for (i; i < l; i++) {
                item = this.getItemByItemId(changes[i].item_id);
                if (!item && changes[i].count > 0) {
                    this.addItem(this.createBagItem(changes[i]), from);
                    if (changes[i].item_id >= 53609000 && changes[i].item_id <= 53817000) {
                        item = ItemManager.get(changes[i].item_id) 
                        Araris.sendTgNotification(`${Character.name} находит ${item.name}!`);
                    }
                } else {
                    if (Araris.settings.sellDrop && from != 'wear')
                        Araris.BagCallback(item, changes[i]);
                    this.removeItem(changes[i], from);
                }
            }
            Inventory.update();
        };
    };
    Araris.BagCallback = async function (item, changes) {
        if (!item || changes.count <= 2 || item.count > changes.count) // items > changes => selling
            return;
        let obj = item.obj;
        if (obj.type == 'yield' || obj.type == 'recipe')
            return;
        if (obj.named || obj.set || obj.unique | obj.item_level > 0 | obj.traderlevel > 20)
            return;

        await GameMap.AjaxAsync.wait(Araris.randomSec(1,20));

        var data = {
            inv_id: Bag.getItemByItemId(obj.item_id).inv_id,
            count: 1,
            last_inv_id: Bag.getLastInvId()
        };
        let json = await GameMap.AjaxAsync.remoteCall('shop_trader', 'sell', data);
        if (json.error) {
            new UserMessage(json.error, UserMessage.TYPE_ERROR).show();
        }
        else {
            Character.setMoney(json.money);
            Bag.updateChanges(json.changes) || {};
        }
    };
	Araris.loadForts = async function() {
		if(Character.homeTown.alliance_id === 0){
			return;
		}
		let r = GameMap.AjaxAsync.remoteCallMode('alliance', 'get_data', {'alliance_id': Character.homeTown.alliance_id});
        if(r.error) {
            return;
        }
        let forts = r.data.forts
        forts.forEach(fort => {
            Araris.forts.push({"fort_id": fort.fort_id, "name": fort.name, "type": fort.type});
        });
        }
    Araris.addSleepPlacesItems = function(combobox) {
        combobox.addItem(-3, "Ближайший отель");
        combobox.addItem(-4, "Ближайший форт");
        combobox.addItem(-5, "Ближайший биг");
        combobox.addItem(-2, "None");
        if(Araris.homeTown != null) {
            combobox.addItem(-1,Araris.homeTown.name);
        }
        if (Araris.forts.length == 0) Araris.loadForts();
        for(var i = 0 ; i < Araris.forts.length;i++) {
            var type = (Araris.forts[i].type == 0) ? "Малый" : (Araris.forts[i].type == 1)? "Средний" : "Биг";
            combobox.addItem(i.toString(),Araris.forts[i].name + "  -  " + type );
        }
    }

    Araris.sleep = async function () {
        if (!Araris.settings.enableRegeneration || Araris.selectedSleepPlace == -2) return;
        Araris.currentState = 3;
        Araris.selectTab("choosenJobs");

		await Araris.equipSet(Araris.travelSet);

        async function getTowns() {
            const response = await GameMap.AjaxAsync.get("map", "get_minimap");
            const significantTowns = Object.values(response.towns)
                .filter(town =>
                    town.member_count &&
                    town.town_points > 50000
                );
            return significantTowns;
        }

        if (Araris.settings.selectedSleepPlace == -1) {
            TaskQueue.add(new TaskSleep(Character.homeTown.town_id, 'luxurious_apartment'));
        } else if (Araris.settings.selectedSleepPlace == -3) {
            const significantTowns = await getTowns();
            const playerPosition = Character.getPosition();
            const nearestTown = significantTowns.reduce((nearest, current) => {
                const currentDistance = GameMap.calcWayTime(playerPosition, current);
                const nearestDistance = nearest ? GameMap.calcWayTime(playerPosition, nearest) : Infinity;
                return currentDistance < nearestDistance ? current : nearest;
            }, null);
            TaskQueue.add(new TaskSleep(nearestTown.town_id, 'luxurious_apartment'));
        } else {
            if (Araris.forts.length == 0) Araris.loadForts();
            TaskQueue.add(new TaskFortSleep(Araris.forts[Araris.settings.selectedSleepPlace].fort_id));
        }
		await GameMap.AjaxAsync.wait(Araris.generateRandomNumber(5, 10) * 1000);
		await Araris.equipSet(Araris.healthSet);
		while(true) {
			if(Character.energy === Character.maxEnergy && !Araris.isHealthBelowLimit()) {
				break;
			}
			if(!Araris.isRunning){
				break;
			}
			await GameMap.AjaxAsync.wait(10000);
		}
		Araris.cancelJobs();
        await GameMap.AjaxAsync.wait(Araris.generateRandomNumber(3, 8) * 1000);
		Araris.run();
    }

    Araris.loadJobs = function (tab) {
        if (Araris.sets == null) Araris.loadSets(function () { });
        if (!Araris.jobsLoaded) {
            new UserMessage("Ищу работы...", UserMessage.TYPE_HINT).show();
            var index = 0;
            var currentLength = 0;
            var maxLength = 299;
            Ajax.get('map', 'get_minimap', {}, function (r) {
                var tiles = [];
                var jobs = [];

                for(var townNumber in r.towns) {
                    if(r.towns[townNumber].town_id == Character.homeTown.town_id) {
                        Araris.homeTown = r.towns[townNumber];
                        break;
                    }
                }

                for (var jobGroup in r.job_groups) {
                    var group = r.job_groups[jobGroup];
                    var jobsGroup = JobList.getJobsByGroupId(parseInt(jobGroup));
                    for (var tilecoord = 0; tilecoord < group.length; tilecoord++) {
                        var xCoord = Math.floor(group[tilecoord][0] / GameMap.tileSize);
                        var yCoord = Math.floor(group[tilecoord][1] / GameMap.tileSize);
                        if (currentLength == 0) {
                            tiles[index] = [];
                        }
                        tiles[index].push([xCoord, yCoord]);
                        currentLength++;
                        if (currentLength == maxLength) {
                            currentLength = 0;
                            index++;
                        }
                        for (var i = 0; i < jobsGroup.length; i++) {
                            jobs.push(new JobPrototype(group[tilecoord][0], group[tilecoord][1], jobsGroup[i].id, jobsGroup[i].groupid));
                        }
                    }
                }

                function onLoad() {
                    Araris.jobsLoaded = true;
                    Araris.allJobs = jobs;
                    Araris.findAllConsumables();
                    Araris.createWindow(tab);
                }


                if (Araris.settings.searchSilver || false) {
                    var loaded = 0;
                    for (var blocks = 0; blocks < tiles.length; blocks++) {
                        GameMap.Data.Loader.load(tiles[blocks], function () {
                            loaded++;
                            if (loaded == tiles.length) onLoad();
                        });
                    }
                } else {
                    onLoad();
                }

            });
        } else {
            Araris.findAllConsumables();
            Araris.createWindow(tab);
        }
    };

    Araris.loadJobData = function (callback) {
        Ajax.get('work','index',{},function(r) {
			if(r.error) {
				return;
			}
			JobsModel.initJobs(r.jobs);
			callback();
		});
    };
    Araris.loadSets = async function (callback) {
        Ajax.remoteCallMode('inventory', 'show_equip', {}, function (r) {
            Araris.sets = r.data;
            callback();
        });
    };
    Araris.loadLanguage = async function () {
        Araris.language = 'ru_RU';
        // Ajax.remoteCall("settings", "settings", {}, function (resp) {
        //     Araris.language = resp.lang.account.key;
        // });
    };
    Araris.loadJobMotivation = async function (index, callback) {
        let r = await GameMap.AjaxAsync.get('job', 'job', { jobId: Araris.addedJobs[index].id, x: Araris.addedJobs[index].x, y: Araris.addedJobs[index].y });
        callback(Math.floor(r.motivation * 100));
    };
    Araris.getJobName = function (id) {
        return JobList.getJobById(id).name;
    };
    Araris.getJobIcon = function (silver, id, x, y) {
        var html = '<div class="centermap" onclick="GameMap.center(' + x + ',' + y + ');"style="position: absolute;background-image: url(\'../images/map/icons/instantwork.png\');width: 20px;height: 20px;top: 0;right: 3px;cursor: pointer;"></div>';
        var silverHtml = "";
        if (silver) {
            silverHtml = '<div class="featured silver"></div>';
        }
        return '<div class="job" style="left: 0; top: 0; position: relative;"><div  onclick="" class="featured"></div>' + silverHtml + html + '<img src="../images/jobs/' + JobList.getJobById(id).shortname + '.png" class="job_icon"></div>';
    };
    Araris.getConsumableIcon = function (src) {
        return "<div class=\"item hasMousePopup\"><img class=\"tw_item item_inventory_img dnd_draggable\" src =" + src + "></div>";
    };
    Araris.checkIfSilver = function (x, y, id) {
        var key = x + "-" + y;
        var jobData = GameMap.JobHandler.Featured[key];
        if (jobData == undefined || jobData[id] == undefined) {
            return false;
        } else {
            return jobData[id].silver;
        }
    };
    Araris.compareUniqueJobs = function (job, jobs) {
        for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].id == job.id) {
                if (job.silver && !jobs[i].silver || (job.silver == jobs[i].silver &&job.distance < jobs[i].distance)){
                    jobs.splice(i, 1);
                    jobs.push(job);
                }
                return;
            }
        }
        jobs.push(job);
    };
    Araris.findJobData = function (job) {
        for (var i = 0; i < JobsModel.Jobs.length; i++) {
            if (JobsModel.Jobs[i].id == job.id) {
                return JobsModel.Jobs[i];
            }
        }
    };
    Araris.parseJobData = function (jobs) {
        for (var job = 0; job < jobs.length; job++) {
            var currentJob = jobs[job];
            var data = Araris.findJobData(currentJob);
            var xp = data.basis.short.experience;
            var money = data.basis.short.money;
            currentJob.setMotivation(data.jobmotivation * 100);
            if (currentJob.silver) {
                xp = Math.ceil(1.5 * xp);
                money = Math.ceil(1.5 * money);
            }
            currentJob.setExperience(xp);
            currentJob.setMoney(money);
        }
    };
    Araris.updateJobDistances = function() {
        for(var i = 0; i < Araris.allJobs.length;i++) {
            Araris.allJobs[i].calculateDistance();
        }
    };
    Araris.getAllUniqueJobs = function () {
        Araris.updateJobDistances();
        var jobs = [];
        for (var i = 0; i < Araris.allJobs.length; i++) {
            var currentJob = Araris.allJobs[i];
            if (Araris.jobFilter.filterJob != "") {
                if (!Araris.getJobName(currentJob.id).toLowerCase().includes(Araris.jobFilter.filterJob)) {
                    continue;
                }
            }
            if (Araris.settings.justCanDo && !JobList.getJobById(currentJob.id).canDo()) {
                continue;
            }
            if (Araris.checkIfJobAdded(currentJob.id)) {
                continue;
            }
            var isSilver = currentJob.silver || Araris.checkIfSilver(currentJob.x, currentJob.y, currentJob.id);
            currentJob.silver = isSilver;
            currentJob.calculateDistance();
            if (isSilver && Araris.settings.filterNoSilver) {
                continue;
            }
            if (!isSilver && Araris.settings.filterOnlySilver) {
                continue;
            }
            if (Araris.settings.filterCenterJobs && currentJob.id < 131) {
                continue;
            }
            if (Araris.settings.onlyTopJobs && currentJob.id < 161) {
                continue;
            }
            Araris.compareUniqueJobs(currentJob, jobs);
        }
        Araris.parseJobData(jobs);

        var experienceSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return 1;
            }
            if (a != null && b == null) {
                return -1;
            }
            var a1 = a.experience;
            var b1 = b.experience;
            return (a1 > b1) ? -1 : (a1 < b1) ? 1 : 0;
        };
        var reverseExperienceSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            var a1 = a.experience;
            var b1 = b.experience;
            return (a1 > b1) ? 1 : (a1 < b1) ? -1 : 0;
        };
        var distanceSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return 1;
            }
            if (a != null && b == null) {
                return -1;
            }
            var a1 = a.distance;
            var b1 = b.distance;
            return (a1 > b1) ? -1 : (a1 < b1) ? 1 : 0;
        };
        var reverseDistanceSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            var a1 = a.distance;
            var b1 = b.distance;
            return (a1 > b1) ? 1 : (a1 < b1) ? -1 : 0;
        };
        var moneySort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return 1;
            }
            if (a != null && b == null) {
                return -1;
            }
            var a1 = a.money;
            var b1 = b.money;
            return (a1 > b1) ? -1 : (a1 < b1) ? 1 : 0;
        };
        var reverseMoneySort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            var a1 = a.money;
            var b1 = b.money;
            return (a1 > b1) ? 1 : (a1 < b1) ? -1 : 0;
        };
        var motivationSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return 1;
            }
            if (a != null && b == null) {
                return -1;
            }
            var a1 = a.motivation;
            var b1 = b.motivation;
            return (a1 > b1) ? -1 : (a1 < b1) ? 1 : 0;
        };
        var reverseMotivationSort = function (a, b) {
            if (a == null && b == null) {
                return 0;
            }
            if (a == null && b != null) {
                return -1;
            }
            if (a != null && b == null) {
                return 1;
            }
            var a1 = a.motivation;
            var b1 = b.motivation;
            return (a1 > b1) ? 1 : (a1 < b1) ? -1 : 0;
        };
        if (Araris.sortJobTableXp == 1) {
            jobs.sort(experienceSort);
        }
        if (Araris.sortJobTableXp == -1) {
            jobs.sort(reverseExperienceSort);
        }
        if (Araris.sortJobTableDistance == 1) {
            jobs.sort(distanceSort);
        }
        if (Araris.sortJobTableDistance == -1) {
            jobs.sort(reverseDistanceSort);
        }
        if (Araris.sortJobTableMoney == 1) {
            jobs.sort(moneySort);
        }
        if (Araris.sortJobTableMoney == -1) {
            jobs.sort(reverseMoneySort);
        }
        if (Araris.sortJobTableMotivation == 1) {
            jobs.sort(motivationSort);
        }
        if (Araris.sortJobTableMotivation == -1) {
            jobs.sort(reverseMotivationSort);
        }
        return jobs;
    };
    Araris.findJob = function (x, y, id) {
        for (var i = 0; i < Araris.allJobs.length; i++) {
            var job = Araris.allJobs[i];
            if (job.id == id && job.x == x && job.y == y) {
                Araris.allJobs[i].setSet(Araris.jobSet);
                return Araris.allJobs[i];
            }
        }
    };
    Araris.addJob = function (x, y, id) {
        if (!Araris.checkIfJobAdded(id)) {
            Araris.addedJobs.push(Araris.findJob(x, y, id));
        }
    };
    Araris.removeJob = function (x, y, id) {
        for (var i = 0; i < Araris.addedJobs.length; i++) {
            if (Araris.addedJobs[i].id == id && Araris.addedJobs[i].x == x && Araris.addedJobs[i].y == y) {
                Araris.addedJobs.splice(i, 1);
                Araris.consolidePosition(i);
                break;
            }
        }
    };
    Araris.checkIfJobAdded = function (id) {
        for (var i = 0; i < Araris.addedJobs.length; i++) {
            if (Araris.addedJobs[i].id == id) {
                return true;
            }
        }
        return false;
    };
    Araris.findAddedJob = function (x, y, id) {
        for (var i = 0; i < Araris.addedJobs.length; i++) {
            if (Araris.addedJobs[i].x == x && Araris.addedJobs[i].y == y && Araris.addedJobs[i].id == id) {
                return Araris.addedJobs[i];
            }
        }
        return null;
    };
    Araris.getJobSet = function (x, y, id) {
        var job = Araris.findAddedJob(x, y, id);
        if (job != null)
            return job.set;
    };
    Araris.setSetForAllJobs = function () {
        for (var i = 0; i < Araris.addedJobs.length; i++) {
            if (Araris.addedJobs[i].set == -1)
                Araris.addedJobs[i].setSet(Araris.jobSet);
        }
    };
    Araris.consolidePosition = function (removeIndex) {
        if (removeIndex <= Araris.currentJob.job && Araris.currentJob.job > 0) {
            Araris.currentJob.job--;
        }
        if (Araris.addedJobs.length == 1) {
            Araris.currentJob.direction = true;
        }
    }
    Araris.parseStopMotivation = function () {
        for (var i = 0; i < Araris.addedJobs.length; i++) {
            var stopMotivation = $(".dobby2window #x-" + Araris.addedJobs[i].x + "y-" + Araris.addedJobs[i].y + "id-" + Araris.addedJobs[i].id).prop("value");
            if (Araris.isNumber(stopMotivation)) {
                Araris.addedJobs[i].setStopMotivation(parseInt(stopMotivation));
            } else {
                return false;
            }
        }
        return true;
    };
    Araris.getItemImage = function (id) {
        return ItemManager.get(id).wear_image;
    };
    Araris.findAllConsumables = function () {
        if (Araris.searchKeys[Araris.language] == undefined) return;
        var energyConsumes = Bag.search(Araris.searchKeys[Araris.language].energy);
        for (var i = 0; i < energyConsumes.length; i++) {
            Araris.addConsumable(energyConsumes[i]);
        }
        var motivationConsumes = Bag.search(Araris.searchKeys[Araris.language].motivation);
        for (var i = 0; i < motivationConsumes.length; i++) {
            Araris.addConsumable(motivationConsumes[i]);
        }
        var healthConsumes = Bag.search(Araris.searchKeys[Araris.language].health);
        for (var i = 0; i < healthConsumes.length; i++) {
            Araris.addConsumable(healthConsumes[i]);
        }
    };
    Araris.CheckIfConsumableAdded = function (item) {
        if (item == undefined)
            return true;
        for (var i = 0; i < Araris.allConsumables.length; i++) {
            if (Araris.allConsumables[i].id == item.obj.item_id) {
                return true;
            }
        }
        return false;
    };
    Araris.addConsumable = function (item) {
        if (Araris.CheckIfConsumableAdded(item)) {
            return;
        }
        var consumable = new ConsumablePrototype(item.obj.item_id, item.obj.image, item.obj.name);
        var bonuses = Araris.parseConsumableBonuses(item.obj.usebonus);
        if (bonuses[0] == 0 && bonuses[1] == 0 && bonuses[2] == 0)
            return;
        consumable.setEnergy(bonuses[0]);
        consumable.setMotivation(bonuses[1]);
        consumable.setHealth(bonuses[2]);
        consumable.setCount(item.count);
        Araris.allConsumables.push(consumable);
    };
    Araris.removeConsumable = function (item) {
        var index;
        for (var i = 0; i < Araris.allConsumables.length; i++) {
            if (Araris.allConsumables[i].id == item.id) {
                index = i;
                break;
            }
        }
        if (index != undefined) {
            if (Araris.allConsumables[index].count > 1) {
                Araris.allConsumables[index].count--;
            } else {
                Araris.allConsumables.slice(index, 1);
            }
        }
    };
    Araris.parseConsumableBonuses = function (bonuses) {
        var getBonus = function (text, type) {
            switch (type) {
                case 0:
                    text = text.replace(Araris.searchKeys[Araris.language].energyText, "");
                    break;
                case 1:
                    text = text.replace(Araris.searchKeys[Araris.language].motivationText, "")
                    break;
                case 2:
                    text = text.replace(Araris.searchKeys[Araris.language].healthText, "");
                    break;
            }
            text = text.slice(1);
            text = text.replace("%", "");
            return parseInt(text);
        }
        var result = Array(3).fill(0);
        for (var i = 0; i < bonuses.length; i++) {
            var type = -1;
            if (bonuses[i].includes(Araris.searchKeys[Araris.language].energyText)) {
                type = 0;
            } else if (bonuses[i].includes(Araris.searchKeys[Araris.language].motivationText)) {
                type = 1;
            } else if (bonuses[i].includes(Araris.searchKeys[Araris.language].healthText)) {
                type = 2;
            }
            if (type != -1)
                result[type] = getBonus(bonuses[i], type);

        }
        return result;
    };
    Araris.filterConsumables = function (energy, motivation, health) {
        if (energy && motivation && health || !energy && !motivation && !health) return Araris.allConsumables;

        var result = [];
        for (var i = 0; i < Araris.allConsumables.length; i++) {
            if (energy && Araris.allConsumables[i].energy
                || motivation && Araris.allConsumables[i].motivation
                || health && Araris.allConsumables[i].health)
                    result.push(Araris.allConsumables[i]);
        }
        return result;
    };
    Araris.changeConsumableSelection = function (id, selected) {
        for (var i = 0; i < Araris.allConsumables.length; i++) {
            if (Araris.allConsumables[i].id == id) {
                Araris.allConsumables[i].setSelected(selected);
                break;
            }
        }
    };
    Araris.changeSelectionAllConsumables = function (selected) {
        for (var i = 0; i < Araris.allConsumables.length; i++) {
            Araris.allConsumables[i].setSelected(selected);
        }
    };
    Araris.canUseConsume = function (item) {
        if (BuffList.cooldowns[item.id] != undefined && BuffList.cooldowns[item.id].time > new ServerDate().getTime()) {
            return false;
        }
        return true;
    };
    Araris.useConsumable = async function (itemToUse) {
        var item = Bag.getItemByItemId(itemToUse.id);
        item.showCooldown();
        Araris.currentState = 2;
        Araris.selectTab("choosenJobs");
        while (true) {
            if (Araris.canUseConsume(itemToUse)) {
                if (Araris.healthSet != -1) {
                    Araris.equipSet(Araris.healthSet);
                    await new Promise(r => setTimeout(r, Araris.settings.setWearDelay * 864));
                }
                Araris.removeConsumable(itemToUse);
                Araris.consumableUsed.push(itemToUse);
                ItemUse.doIt(itemToUse.id);
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        while (true) {
            if (!Araris.canUseConsume(itemToUse)) {
                $(".tw2gui_dialog_framefix").remove();
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        Araris.run();
    };
    Araris.findProperConsumable = function (motivationMissing, energyMissing, healthMissing, averageMotivationMissing, consumables) {
        var betterEnergy = function (item1, item2) {
            var distanceItem1 = Math.abs(energyMissing - item1.energy);
            var distanceItem2 = Math.abs(energyMissing - item2.energy);
            return (distanceItem1 < distanceItem2) ? -1 : (distanceItem1 > distanceItem2) ? 1 : 0;
        };
        var betterMotivation = function (item1, item2) {
            var distanceItem1 = Math.abs(averageMotivationMissing - item1.motivation);
            var distanceItem2 = Math.abs(averageMotivationMissing - item2.motivation);
            return (distanceItem2 < distanceItem1) ? item2 : item1;
        };
        var findMotivationConsume = function (consumes) {
            var consumeToChoose = null;
            for (var i = 0; i < consumes.length; i++) {
                if (consumeToChoose == null && consumes[i].motivation != 0) {
                    consumeToChoose = consumes[i];
                    continue;
                }
                if (consumeToChoose != null && consumes[i].motivation != 0) {
                    consumeToChoose = betterMotivation(consumeToChoose, consumables[i]);
                }
            }
            return consumeToChoose;
        };
        var findHealthConsume = function (consumes) {
            for (var i = 0; i < consumes.length; i++) {
                if (consumes[i].health != 0) {
                    return consumes[i];
                }
            }
            return null;
        };
        if (consumables.length == 0) return null;
        var consums = consumables;
        consums = consums.sort(betterEnergy);
        if (energyMissing == 100) {
            return consums[0];
        }
        if (motivationMissing == Araris.addedJobs.length) {
            return findMotivationConsume(consums);
        }
        if (Araris.isHealthBelowLimit()) {
            return findHealthConsume(consums);
        }
    };
    Araris.tryUseConsumable = async function (result) {
        var healthMissing = 100 - (Character.health / Character.maxHealth) * 100;
        var energyMissing = 100 - (Character.energy / Character.maxEnergy) * 100;
        var motivationMissing = Araris.jobsBelowMotivation(result);
        var consumables = Araris.allConsumables;
        var averageMotivationMissing = Araris.averageMissingMotivation(result);
        var selectedConsumes = [];
        for (var i = 0; i < consumables.length; i++) {
            if (consumables[i].selected)
                selectedConsumes.push(consumables[i]);
        }
        var itemToUse = Araris.findProperConsumable(motivationMissing, energyMissing, healthMissing, averageMotivationMissing, selectedConsumes);
        if (itemToUse == null)  {
            if (Araris.settings.enableRegeneration) {
                await Araris.sleep();
                return true;
            }
            return false;
        }
        Araris.useConsumable(itemToUse);
        return true;
    };
    Araris.calculateDistances = function () {
        for (var i = 0; i < Araris.addedJobs.length; i++) {
            Araris.addedJobs[i].calculateDistance();
        }
    };
    Araris.createDistanceMatrix = function () {
        var distances = new Array(Araris.addedJobs.length);
        for (var i = 0; i < distances.length; i++) {
            distances[i] = new Array(Araris.addedJobs.length);
        }
        for (var i = 0; i < distances.length; i++) {
            for (var j = i; j < distances[i].length; j++) {
                if (i == j) {
                    distances[i][j] = distances[j][i] = Number.MAX_SAFE_INTEGER;
                    continue;
                }
                distances[i][j] = distances[j][i] = GameMap.calcWayTime({ x: Araris.addedJobs[i].x, y: Araris.addedJobs[i].y }, { x: Araris.addedJobs[j].x, y: Araris.addedJobs[j].y });
            }
        }
        return distances;
    };
    Araris.createRoute = function () {
        Araris.calculateDistances();
        var closestJobIndex = 0;
        var closestDistance = Araris.addedJobs[0].distance;
        var route = [];
        var distances = Araris.createDistanceMatrix();
        var getClosestJob = function (index, route, distances) {
            var closestDistance = Number.MAX_SAFE_INTEGER;
            var closestIndex = -1;
            for (var i = 0; i < distances.length; i++) {
                if (index == i || route.includes(i)) {
                    continue;
                }
                if (distances[i][index] < closestDistance) {
                    closestDistance = distances[i][index];
                    closestIndex = i;
                }
            }
            return closestIndex;
        };
        for (var i = 1; i < Araris.addedJobs.length; i++) {
            if (Araris.addedJobs[i].distance < closestDistance) {
                closestDistance = Araris.addedJobs[i].distance;
                closestJobIndex = i;
            }
        }
        route.push(closestJobIndex);
        while (route.length < Araris.addedJobs.length) {
            var closestJob = getClosestJob(route[route.length - 1], route, distances);
            route.push(closestJob);
        }
        var addedJobsOrder = [];
        for (var i = 0; i < route.length; i++) {
            addedJobsOrder.push(Araris.addedJobs[route[i]]);
        }
        Araris.addedJobs = addedJobsOrder;
        Araris.selectTab("choosenJobs");
    };
    Araris.equipSet = async function (set) {
        if (set == -1) return true;
        EquipManager.switchEquip(Araris.sets[set].equip_manager_id);
        while (true) {
            let finished = await Araris.isGearEquiped(Araris.getSetItemArray(Araris.sets[set]));
            if (finished) break;
            await new Promise(r => setTimeout(r, 1));
        }
        return Promise.resolve(true);
    };
    Araris.getSetItemArray = function (set) {
        var items = [];
        ['head', 'neck', 'body', 'right_arm', 'left_arm', 'belt', 'foot', 'animal', 'yield', 'pants'].forEach(item => {
            if (set[item] != null) items.push(set[item]);
        });
        return items;
    };
    Araris.isWearing = function (itemId) {
        if (Wear.wear[ItemManager.get(itemId).type] == undefined) return false;
        return Wear.wear[ItemManager.get(itemId).type].obj.item_id == itemId;
    };
    Araris.isGearEquiped = async function (items) {
        for (var i = 0; i < items.length; i++) {
            if (!Araris.isWearing(items[i])) return false;
        }
        return true;
    }
    Araris.getBestGear = function (jobid) {
        var modelId = function (jobid) {
            for (var i = 0; i < JobsModel.Jobs.length; i++) {
                if (JobsModel.Jobs[i].id == jobid)
                    return i;
            }
            return -1;
        }
        var model = JobsModel.Jobs[modelId(jobid)];

        var set = west.item.Calculator.getBestSet(model.get('skills'), jobid),
            items = set && set.getItems() || [],
            invItems = Bag.getItemsByItemIds(items),
            bestItems = [], i, invItem, wearItem;
        for (i = 0; i < invItems.length; i++) {
            invItem = invItems[i];
            wearItem = Wear.get(invItem.getType());
            if (!wearItem || (wearItem && (wearItem.getItemBaseId() !== invItem.getItemBaseId() || wearItem.getItemLevel() < invItem.getItemLevel()))) {
                bestItems.push(invItem.obj.item_id);
            }
        }

        return bestItems;
    };
    Araris.equipBestGear = async function (jobid) {
        var bestGear = Araris.getBestGear(jobid);
        if (bestGear == null) return Promise.resolve(true);
        for (var i = 0; i < bestGear.length; i++) {
            if (!Araris.isWearing(bestGear[i]))
                Wear.carry(Bag.getItemByItemId(bestGear[i]));
        }
        while (true) {
            let finished = await Araris.isGearEquiped(bestGear);
            if (finished) break;
            await new Promise(r => setTimeout(r, 1));
        }
        return Promise.resolve(true);
    };
    Araris.checkMotivation = function (index, result, callback) {
        var check = function (index, result) {
            Araris.loadJobMotivation(index, function (motivation) {
                result.push(motivation);
                if (index + 1 < Araris.addedJobs.length) {
                    check(++index, result);
                } else
                    if (index + 1 == Araris.addedJobs.length) {
                        callback(result);
                        return;
                    }
            });
        };
        check(index, result);
    };
    Araris.isMotivationAbove = function (result) {
        for (var i = 0; i < result.length; i++) {
            if (result[i] > Araris.addedJobs[i].stopMotivation) {
                return true;
            }
        }
        return false;
    };
    Araris.jobsBelowMotivation = function (result) {
        var count = 0;
        for (var i = 0; i < result.length; i++) {
            if (result[i] <= Araris.addedJobs[i].stopMotivation) {
                count++;
            }
        }
        return count;
    };
    Araris.averageMissingMotivation = function (result) {
        var motivation = 0;
        for (var i = 0; i < result.length; i++) {
            motivation += (100 - result[i]);
        }
        return motivation / result.length;
    };
    Araris.isHealthBelowLimit = function () {
        return Araris.settings.healthStop >= Character.health / Araris.health * 100;
    };
    Araris.isStopMotivationZero = function () {
        for (var i = 0; i < Araris.addedJobs.length; i++) {
            if (Araris.addedJobs[i].stopMotivation == 0) {
                return true;
            }
        }
        return false;
    };
    Araris.canAddMissing = function (result) {
        if (!Araris.settings.addMotivation && Araris.jobsBelowMotivation(result) && !Araris.isStopMotivationZero()) {
            return false;
        }
        if (!Araris.settings.addEnergy && !Araris.settings.enableRegeneration && Character.energy == 0) {
            return false;
        }
        if (!Araris.settings.addHealth && !Araris.settings.enableRegeneration && Araris.isHealthBelowLimit()) {
            return false;
        }
        return true;
    };
    Araris.finishRun = async function () {
        await GameMap.AjaxAsync.wait(1500);
        Araris.currentState = 0;
        Araris.isRunning = false;
        Araris.selectTab("choosenJobs");
    };
    Araris.updateStatistics = function (oldXp) {
        var xpDifference = Character.experience - oldXp;
        Araris.statistics.xpInSession += xpDifference;
        Araris.statistics.totalXp += xpDifference;
    }
    Araris.run =  function () {
        Araris.checkMotivation(0, [], async function (result) {
            if ((Araris.isMotivationAbove(result) || Araris.isStopMotivationZero()) && Character.energy > 0 && !Araris.isHealthBelowLimit()) {
                Araris.currentState = 1;
                Araris.selectTab("choosenJobs");
                Araris.prepareJobRun(Araris.currentJob.job);
            } else {
                if (!Araris.canAddMissing(result)) {
                    Araris.finishRun();
                } else {
                    var answer = await Araris.tryUseConsumable(result);
                    if (!answer) {
                        Araris.finishRun();
                    }
                }
            }
        });
    };
    Araris.prepareJobRun = function (index) {
        setTimeout(function () {
            Araris.loadJobMotivation(index, async function (motivation) {
                if (Character.energy == 0 || Araris.isHealthBelowLimit()) {
                    Araris.run();
                    return;
                }
                if (motivation <= Araris.addedJobs[index].stopMotivation && Araris.addedJobs[index].stopMotivation > 0) {
                    Araris.changeJob();
                } else
                    if (GameMap.calcWayTime(Character.position, { x: Araris.addedJobs[index].x, y: Araris.addedJobs[index].y }) == 0) {
                        var maxJobs;
                        (Premium.hasBonus('automation')) ? maxJobs = 9 : maxJobs = 4;
                        if (Araris.addedJobs[index].stopMotivation != 0) {
                            var numberOfJobs = Math.min(Math.min(motivation - Araris.addedJobs[index].stopMotivation, Character.energy), maxJobs);
                        } else {
                            var numberOfJobs = Math.min(Character.energy, maxJobs);
                        }
                        Araris.runJob(index, numberOfJobs);
                    } else {
                        var equiped = await Araris.equipSet(Araris.travelSet);
                        await Araris.walkToJob(index);
                    }
            });
        }, Araris.generateRandomNumber(Araris.settings.jobDelayMin, Araris.settings.jobDelayMax) * 1000);
    };
    Araris.walkToJob = async function (index) {
        let currentJob = Araris.addedJobs[index];
        let lowLvlJob = JobList
            .getJobsByGroupId(currentJob.groupid)
            .sort((a, b) => a.level - b.level)[0];
        JobWindow.startJob(lowLvlJob.id, Araris.addedJobs[index].x, Araris.addedJobs[index].y, 15);
        await new Promise(r => setTimeout(r, 4000));
        var equiped = await Araris.equipSet(Araris.jobSet);
        while (true) {
            if (GameMap.calcWayTime(Character.position, { x: Araris.addedJobs[index].x, y: Araris.addedJobs[index].y }) == 0) {
                break;
            }
            if (!Araris.isRunning) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        if (Araris.isRunning) {
            Araris.cancelJobs();
            Araris.prepareJobRun(index);
        }
    };
    Araris.changeJob = function () {
        Araris.currentJob.job++;
        if (Araris.currentJob.job == Araris.addedJobs.length) {
            Araris.currentJob.job = 0;
        }
        Araris.saveData();
        Araris.run();
    };
    Araris.runJob = async function (jobIndex, jobCount) {
        var job = Araris.addedJobs[jobIndex];
        Araris.statistics.jobsInSession += jobCount;
        Araris.statistics.totalJobs += jobCount;
        job.motivation -= jobCount;
        var oldXp = Character.experience;
        if (job.equipBestClothes) await Araris.equipBestGear(job.id);
        await new Promise(r => setTimeout(r, 1000 + 1000 * Math.random()));
        var duration = 15;
        var tasks = [];
        for (var i = 0; i < jobCount; i++) {
            tasks.push(new TaskJob(job.id, job.x, job.y, duration));
        }
        TaskQueue.add(tasks);

        await new Promise(r => setTimeout(r, Araris.settings.setWearDelay * 1000));
        Araris.equipSet(job.set);
        while (true) {
            if (TaskQueue.queue.length == 0) {
                Araris.updateStatistics(oldXp);
                Araris.saveData();
                Araris.prepareJobRun(jobIndex);
                return;
            }
            if (!Araris.isRunning || Araris.isHealthBelowLimit()) {
                break;
            }
            await new Promise(r => setTimeout(r, 500));
        }
        Araris.statistics.jobsInSession -= TaskQueue.queue.length;
        Araris.statistics.totalJobs -= TaskQueue.queue.length;
        job.motivation += TaskQueue.queue.length;
        Araris.updateStatistics(oldXp);
        Araris.saveData();
        await Araris.cancelJobs();

    };
    Araris.cancelJobs = async function () {
        if (TaskQueue.queue.length > 0) {
            let endTaskMs = TaskQueue.queue[0].getEndDate() - Date.now();
            let length = TaskQueue.queue.length;
            //if (length == 9 || length == 4) await GameMap.AjaxAsync.wait(3000 + endTaskMs);
            if (length > 1 && endTaskMs < 1500) await GameMap.AjaxAsync.wait(3000);
            else if (length == 1 && endTaskMs < 1500) await GameMap.AjaxAsync.wait(7000);
            TaskQueue.cancelAll();
            await GameMap.AjaxAsync.WaitJobsAsync();
        }
    };
    Araris.saveData = function () {
        Araris.savePermanentData();
        Araris.saveTempData();
    };
    Araris.saveTempData = function () {
        var temporaryObject = {
            addedJobs: Araris.addedJobs,
            currentJob: Araris.currentJob
        };
        sessionStorage.araris = JSON.stringify(temporaryObject);
    };
    Araris.savePermanentData = function () {
        var permanentObject = {
            settings: Araris.settings,
            totalJobs: Araris.statistics.totalJobs,
            totalXp: Araris.statistics.totalXp,
            travelSet: Araris.travelSet,
            jobSet: Araris.jobSet,
            healthSet: Araris.healthSet
        };
        localStorage.araris = JSON.stringify(permanentObject);
    };
    Araris.loadData = function () {
        var tmpStorage = sessionStorage.araris;
        if (tmpStorage != null) {
            var tempObject = JSON.parse(tmpStorage);
            var tmpAddedJobs = tempObject.addedJobs;
            for (var j = 0; j < tmpAddedJobs.length; j++) {
                var jobP = new JobPrototype(tmpAddedJobs[j].x, tmpAddedJobs[j].y, tmpAddedJobs[j].id, tmpAddedJobs[j].groupid);
                jobP.setSilver(tmpAddedJobs[j].silver);
                jobP.distance = tmpAddedJobs[j].distance;
                jobP.equipBestClothes = tmpAddedJobs[j].equipBestClothes;
                jobP.setExperience(tmpAddedJobs[j].experience);
                jobP.setMoney(tmpAddedJobs[j].money);
                jobP.setMotivation(tmpAddedJobs[j].motivation);
                jobP.setStopMotivation(tmpAddedJobs[j].stopMotivation);
                jobP.setSet(tmpAddedJobs[j].set);
                Araris.addedJobs.push(jobP);
            }
            Araris.currentJob = tempObject.currentJob;
            Araris.setSetForAllJobs();
        }
        var ararisStorage = localStorage.araris;
        if (ararisStorage != null) {
            var permanentObject = JSON.parse(ararisStorage);
            Araris.settings = permanentObject.settings;
            Araris.statistics.totalJobs = permanentObject.totalJobs;
            Araris.statistics.totalXp = permanentObject.totalXp;
            Araris.travelSet = permanentObject.travelSet;
            Araris.jobSet = permanentObject.jobSet;
            Araris.healthSet = permanentObject.healthSet;
        }
    };
    Araris.createWindow = function (tabId) {
        var window = wman.open("Araris")
            .setResizeable(false)
            .setMinSize(750, 480)
            .setSize(750, 480)
            .setMiniTitle("Araris");
        var tabs = {
            "jobs": "Работы",
            "sets": "Шмот",
            "consumables": "Бафы",
            "choosenJobs": "Старт",
            "stats": "Статистика",
            "settings": "Настройки",
            "event": "Допы",
        };
        var tabLogic = function (win, id) {
            var content = $('<div class=\'dobby2window\'/>');
            switch (id) {
                case "jobs":
                        Araris.loadJobData(function () {
                        Araris.removeActiveTab(this);
                        Araris.removeWindowContent();
                        Araris.addActiveTab("jobs", this);
                        content.append(Araris.createJobsTab());
                        Araris.window.appendToContentPane(content);
                        Araris.addJobTableCss();
                        $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({ "top": Araris.jobTablePosition.content });
                        $(".dobby2window .tw2gui_scrollbar_pulley").css({ "top": Araris.jobTablePosition.scrollbar });
                        Araris.addEventsHeader();
                    });
                    break;
                case "choosenJobs":
                    Araris.removeActiveTab(this);
                    Araris.removeWindowContent();
                    Araris.addActiveTab("choosenJobs", this);
                    content.append(Araris.createAddedJobsTab());
                    Araris.window.appendToContentPane(content);
                    $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({ "top": Araris.addedJobTablePosition.content });
                    $(".dobby2window .tw2gui_scrollbar_pulley").css({ "top": Araris.addedJobTablePosition.scrollbar });
                    Araris.addAddedJobsTableCss();
                    break;
                case "consumables":
                    Araris.removeActiveTab(this);
                    Araris.removeWindowContent();
                    Araris.addActiveTab("consumables", this);
                    Araris.findAllConsumables();
                    content.append(Araris.createConsumablesTable());
                    Araris.window.appendToContentPane(content);
                    $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css({ "top": Araris.consumableTablePosition.content });
                    $(".dobby2window .tw2gui_scrollbar_pulley").css({ "top": Araris.consumableTablePosition.scrollbar });
                    Araris.addConsumableTableCss();
                    break;
                case "sets":
                    Araris.loadSets(function () {
                        Araris.removeActiveTab(this);
                        Araris.removeWindowContent();
                        Araris.addActiveTab("sets", this);
                        content.append(Araris.createSetGui())
                        Araris.window.appendToContentPane(content);
                    });
                    break;
                case "stats":
                    Araris.removeActiveTab(this);
                    Araris.removeWindowContent();
                    Araris.addActiveTab("stats", this);
                    content.append(Araris.createStatisticsGui());
                    Araris.window.appendToContentPane(content);
                    break;
                case "settings":
                    Araris.removeActiveTab(this);
                    Araris.removeWindowContent();
                    Araris.addActiveTab("settings", this);
                    content.append(Araris.createSettingsGui());
                    Araris.window.appendToContentPane(content);
                    break;
                case "event":
                    Araris.removeActiveTab(this);
                    Araris.removeWindowContent();
                    Araris.addActiveTab("event", this);
                    content.append(Araris.createEventGui());
                    Araris.window.appendToContentPane(content);
                    break;
            }
        }
        for (var tab in tabs) {
            window.addTab(tabs[tab], tab, tabLogic);
        }
        Araris.window = window;



        if (tabId) Araris.selectTab(tabId);
        else if (Araris.addedJobs != null && Araris.addedJobs.length > 0) Araris.selectTab("choosenJobs");
        else Araris.selectTab("jobs");
        if (Araris.isTwin) {
            Araris.window.divMain.style.left='0px';
            Araris.window.divMain.style.top='185px';
        }
    };
    Araris.selectTab = function (key) {
        Araris.window.tabIds[key].f(Araris.window, key);
    };
    Araris.removeActiveTab = function (window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };
    Araris.addActiveTab = function (key, window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };
    Araris.removeWindowContent = function () {
        $(".dobby2window").remove();
    };
    Araris.addJobTableCss = function () {
        $(".dobby2window .jobIcon").css({ "width": "80px" });
        $(".dobby2window .jobName").css({ "width": "150px" });
        $(".dobby2window .jobXp").css({ "width": "40px" });
        $(".dobby2window .jobMoney").css({ "width": "40px" });
        $(".dobby2window .jobMotivation").css({ "width": "40px" });
        $(".dobby2window .jobDistance").css({ "width": "100px" });
        $(".dobby2window .row").css({ "height": "60px" });
        $('.dobby2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    Araris.addAddedJobsTableCss = function () {
        $(".dobby2window .jobIcon").css({ "width": "80px" });
        $(".dobby2window .jobName").css({ "width": "130px" });
        $(".dobby2window .jobStopMotivation").css({ "width": "110px" });
        $(".dobby2window .jobRemove").css({ "width": "105px" });
        $(".dobby2window .jobSet").css({ "width": "100px" });
        $(".dobby2window .row").css({ "height": "60px" });
        $('.dobby2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    Araris.addConsumableTableCss = function () {
        $(".dobby2window .consumIcon").css({ "width": "80px" });
        $(".dobby2window .consumName").css({ "width": "120px" });
        $(".dobby2window .consumCount").css({ "width": "70px" });
        $(".dobby2window .consumEnergy").css({ "width": "70px" });
        $(".dobby2window .consumMotivation").css({ "width": "70px" });
        $(".dobby2window .consumHealth").css({ "width": "70px" });
        $(".dobby2window .row").css({ "height": "80px" });
        $('.dobby2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    Araris.addEventsHeader = function () {
        $(".dobby2window .jobXp").click(function () {
            if (Araris.sortJobTableXp == 0) {
                Araris.sortJobTableXp = 1;
            } else {
                (Araris.sortJobTableXp == 1) ? Araris.sortJobTableXp = -1 : Araris.sortJobTableXp = 1;
            }
            Araris.sortJobTableDistance = 0;
            Araris.sortJobTableMoney = 0;
            Araris.sortJobTableMotivation = 0;
            Araris.selectTab("jobs");
        });
        $(".dobby2window .jobDistance").click(function () {
            if (Araris.sortJobTableDistance == 0) {
                Araris.sortJobTableDistance = 1;
            } else {
                (Araris.sortJobTableDistance == 1) ? Araris.sortJobTableDistance = -1 : Araris.sortJobTableDistance = 1;
            }
            Araris.sortJobTableMoney = 0;
            Araris.sortJobTableMotivation = 0;
            Araris.sortJobTableXp = 0;
            Araris.selectTab("jobs");
        });
        $(".dobby2window .jobMoney").click(function () {
            if (Araris.sortJobTableMoney == 0) {
                Araris.sortJobTableMoney = 1;
            } else {
                (Araris.sortJobTableMoney == 1) ? Araris.sortJobTableMoney = -1 : Araris.sortJobTableMoney = 1;
            }
            Araris.sortJobTableDistance = 0;
            Araris.sortJobTableMotivation = 0;
            Araris.sortJobTableXp = 0;
            Araris.selectTab("jobs");
        });
        $(".dobby2window .jobMotivation").click(function () {
            if (Araris.sortJobTableMotivation == 0) {
                Araris.sortJobTableMotivation = 1;
            } else {
                (Araris.sortJobTableMotivation == 1) ? Araris.sortJobTableMotivation = -1 : Araris.sortJobTableMotivation = 1;
            }
            Araris.sortJobTableDistance = 0;
            Araris.sortJobTableMoney = 0;
            Araris.sortJobTableXp = 0;
            Araris.selectTab("jobs");
        });
    };
    Araris.createJobsTab = function () {
        var htmlSkel = $("<div id='jobs_overview'></div>");
        var html = $("<div class='jobs_search' style='position:relative;margin-bottom:95px;'>" +
            "<div id='search_row' style='position:absolute;top:-4px;left:5px;;display:flex;align-items:center;'>" +
                "<div id='jobFilter' style='flex:1;'></div>" +
                "<div id='button_filter_jobs' style='margin-left:0px;transform:scale(0.8);'></div>" +
            "</div>" +

            "<div id='checkbox_row1' style='position:absolute;top:24px;left:-2px;right:1px;display:flex;gap:0px;'>" +
                "<div id='job_search_silver' style='transform:scale(0.8);'></div>" +
                "<div id='job_only_silver' style='transform:scale(0.8);'></div>" +
            "</div>" +

            "<div id='checkbox_row2' style='position:absolute;top:41px;left:-1px;right:5px;display:flex;gap:0px;'>" +
                "<div id='job_center' style='transform:scale(0.8);'></div>" +
                "<div id='job_no_silver' style='transform:scale(0.8);margin-left:15px;'></div>" +
                "<div id='import_export_buttons' style='position:absolute;right:100px;bottom:-8px'></div>" +
                "<div id='button_tab2' style='position:absolute;right:0;bottom:-8px;'></div>" +
            "</div>" +

            "<div id='checkbox_row3' style='position:absolute;top:59px;left:-4px;right:5px;display:flex;gap:0px;'>" +
                "<div id='job_only_top' style='transform:scale(0.8);'></div>" +
                "<div id='job_just_can_do' style='transform:scale(0.8);margin-left:-13px;'></div>" +
            "</div>" +

            "</div>"
        );
        var table = new west.gui.Table();
        var xpIcon = '<img src="/images/icons/star.png">';
        var dollarIcon = '<img src="/images/icons/dollar.png">';
        var motivationIcon = '<img src="/images/icons/motivation.png">';
        var arrow_desc = '&nbsp;<img src="../images/window/jobs/sortarrow_desc.png"/>';
        var arrow_asc = '&nbsp;<img src="../images/window/jobs/sortarrow_asc.png"/>';
        var uniqueJobs = Araris.getAllUniqueJobs();
        table.addColumn("jobIcon", "jobIcon")
            .addColumn("jobName", "jobName")
            .addColumn("jobXp", "jobXp")
            .addColumn("jobMoney", "jobMoney")
            .addColumn("jobMotivation", "jobMotivation")
            .addColumn("jobDistance", "jobDistance")
            .addColumn("jobAdd", "jobAdd");
        table.appendToCell("head", "jobIcon", "")
            .appendToCell("head", "jobName", "Работа")
            .appendToCell("head", "jobXp", xpIcon + (Araris.sortJobTableXp == 1 ? arrow_asc : Araris.sortJobTableXp == -1 ? arrow_desc : ""))
            .appendToCell("head", "jobMoney", dollarIcon + (Araris.sortJobTableMoney == 1 ? arrow_asc : Araris.sortJobTableMoney == -1 ? arrow_desc : ""))
            .appendToCell("head", "jobMotivation", motivationIcon + (Araris.sortJobTableMotivation == 1 ? arrow_asc : Araris.sortJobTableMotivation == -1 ? arrow_desc : ""))
            .appendToCell("head", "jobDistance", "Время пути " + (Araris.sortJobTableDistance == 1 ? arrow_asc : Araris.sortJobTableDistance == -1 ? arrow_desc : ""))
            .appendToCell("head", "jobAdd", "");
        for (var job = 0; job < uniqueJobs.length; job++) {
            table.appendRow()
                .appendToCell(-1, "jobIcon", Araris.getJobIcon(uniqueJobs[job].silver, uniqueJobs[job].id, uniqueJobs[job].x, uniqueJobs[job].y))
                .appendToCell(-1, "jobName", Araris.getJobName(uniqueJobs[job].id))
                .appendToCell(-1, "jobXp", uniqueJobs[job].experience)
                .appendToCell(-1, "jobMoney", uniqueJobs[job].money)
                .appendToCell(-1, "jobMotivation", uniqueJobs[job].motivation)
                .appendToCell(-1, "jobDistance", uniqueJobs[job].distance.formatDuration())
                .appendToCell(-1, "jobAdd", Araris.createAddJobButton(uniqueJobs[job].x, uniqueJobs[job].y, uniqueJobs[job].id));
        }
        var textfield = new west.gui.Textfield("jobsearch").setPlaceholder("Название работы");
        if (Araris.jobFilter.filterJob != "") {
            textfield.setValue(Araris.jobFilter.filterJob);
        }
        $(textfield.getMainDiv()).find('input').keypress(function(e) {
            if(e.which == 13) {
                buttonFilter.click();
            }
        });

        var checkboxSearchSilver = new west.gui.Checkbox()
            .setLabel("Искать серебро")
            .setSelected(Araris.settings.searchSilver || false)
            .setCallback(function () {
                Araris.settings.searchSilver = this.isSelected();
                Araris.savePermanentData();
            });

        var checkboxOnlySilver = new west.gui.Checkbox()
            .setLabel("Только серебряные")
            .setSelected(Araris.settings.filterOnlySilver || false)
            .setCallback(function () {
                Araris.settings.filterOnlySilver = this.isSelected();
                Araris.savePermanentData();
            });

        var checkboxNoSilver = new west.gui.Checkbox()
            .setLabel("Без серебряных")
            .setSelected(Araris.settings.filterNoSilver || false)
            .setCallback(function () {
                Araris.settings.filterNoSilver = this.isSelected();
                Araris.savePermanentData();
            });

        var checkboxCenterJobs = new west.gui.Checkbox()
            .setLabel("Только центр")
            .setSelected(Araris.settings.filterCenterJobs || false)
            .setCallback(function () {
                Araris.settings.filterCenterJobs = this.isSelected();
                Araris.savePermanentData();
            });

        var checkboxOnlyTop = new west.gui.Checkbox()
            .setLabel("Только топ работы")
            .setSelected(Araris.settings.onlyTopJobs || false)
            .setCallback(function () {
                Araris.settings.onlyTopJobs = this.isSelected();
                Araris.savePermanentData();
            });

        var checkboxJustCanDo = new west.gui.Checkbox()
            .setLabel("Только доступные")
            .setSelected(Araris.settings.justCanDo || false)
            .setCallback(function () {
                Araris.settings.justCanDo = this.isSelected();
                Araris.savePermanentData();
            });

        var buttonFilter = new west.gui.Button("Поиск", function () {
            Araris.jobFilter.filterJob = textfield.getValue();
            Araris.jobTablePosition.content = "0px";
            Araris.jobTablePosition.scrollbar = "0px";
            Araris.selectTab("jobs");
        });
        var buttonNext = new west.gui.Button("Дальше", function () {
            Araris.saveTempData();
            Araris.selectTab("sets");
        });

        var buttonExport = new west.gui.Button("Экспорт", function () {
            createModal('export', uniqueJobs);
        });

        var buttonImport = new west.gui.Button("Импорт", function () {
            createModal('import', {}, function(data) {
                Araris.allJobs = []
                for (var j = 0; j < data.length; j++) {
                    var jobP = new JobPrototype(data[j].x, data[j].y, data[j].id, data[j].groupid);
                    jobP.setSilver(data[j].silver);
                    // jobP.setExperience(data[j].experience);
                    // jobP.setMoney(data[j].money);
                    // jobP.setMotivation(data[j].motivation);
                    Araris.allJobs.push(jobP);
                }
                Araris.selectTab("jobs");
            });
        });

        htmlSkel.append(table.getMainDiv());
        $('#jobFilter', html).append(textfield.getMainDiv());
        $("#button_filter_jobs", html).append(buttonFilter.getMainDiv());
        $("#job_search_silver", html).append(checkboxSearchSilver.getMainDiv());
        $("#job_only_silver", html).append(checkboxOnlySilver.getMainDiv());
        $("#job_no_silver", html).append(checkboxNoSilver.getMainDiv());
        $("#job_center", html).append(checkboxCenterJobs.getMainDiv());
        $("#job_only_top", html).append(checkboxOnlyTop.getMainDiv());
        $("#job_just_can_do", html).append(checkboxJustCanDo.getMainDiv());
        $("#button_tab2", html).append(buttonNext.getMainDiv());

        var importExportDiv = $("#import_export_buttons", html);
        importExportDiv.append(buttonExport.getMainDiv());
        importExportDiv.append(buttonImport.getMainDiv());

        htmlSkel.append(html);
        return htmlSkel;
    };

    function createModal(type, data, callback) {
        var modalWindow = wman.open("ArarisData")
            .setMiniTitle(type === 'export' ? 'Экспорт работ' : 'Импорт работ')
            .setTitle(type === 'export' ? 'Экспорт работ' : 'Импорт работ')
            .setResizeable(false)
            .setMinSize(400, 300)
            .setSize(400, 300);

        var content = $('<div class="dobby2window"></div>').css({
            'padding': '10px',
            'height': '100%',
            'display': 'flex',
            'flex-direction': 'column'
        });

        var textarea = $('<textarea></textarea>').css({
            'width': '300px',
            'height': '200px',
            'margin': '10px',
            'padding': '8px',
            'background-color': '#f8f4e4',
            'border': '1px solid #7b4e24',
            'border-radius': '4px',
            'color': '#352318',
            'font-family': 'Arial, sans-serif',
            'resize': 'none'
        });

        if (type === 'export') {
            try {
                textarea.val(JSON.stringify(data));
            } catch (error) {
                textarea.val('Error: Could not export data');
                console.error('Export error:', error);
            }
        }

        var buttonsDiv = $('<div></div>').css({
            'display': 'flex',
            'justify-content': 'flex-end',
            'gap': '10px',
            'margin': '10px'
        });

        var actionButton = new west.gui.Button(type === 'export' ? 'Копировать' : 'Импорт', function() {
            if (type === 'export') {
                textarea.select();
                document.execCommand('copy');
                new UserMessage("Скопировано!", UserMessage.TYPE_SUCCESS).show();
                modalWindow.destroy();
            } else {
                try {
                    const importedData = JSON.parse(textarea.val());
                    if (callback) callback(importedData);
                    new UserMessage("Импорт завершен!", UserMessage.TYPE_SUCCESS).show();
                    modalWindow.destroy();
                } catch (error) {
                    new UserMessage("Ошибка: Неверный формат данных", UserMessage.TYPE_ERROR).show();
                    console.error('Import error:', error);
                }
            }
        });

        actionButton.setWidth(120);

        buttonsDiv.append(actionButton.getMainDiv());

        content.append(textarea);
        content.append(buttonsDiv);

        modalWindow.appendToContentPane(content);
    }

    Araris.createAddJobButton = function (x, y, id) {
        var buttonAdd = new west.gui.Button("Добавить", function () {
            Araris.addJob(x, y, id);
            Araris.jobTablePosition.content = $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            Araris.jobTablePosition.scrollbar = $(".dobby2window .tw2gui_scrollbar_pulley").css("top");
            Araris.selectTab("jobs");
        });
        buttonAdd.setWidth(100);
        return buttonAdd.getMainDiv();
    };
    Araris.createAddedJobsTab = function () {
        var htmlSkel = $("<div id=\'added_jobs_overview'\></div>");
        var footerHtml = $("<div id=\'start_dobby2'\ style=\'position:relative;'\><span class =\'dobby_state'\ style=\' position:absolute;left:20px; top:10px; font-family: Arial, Helvetica, sans-serif; font-size: 15px;font-weight: bold;'\> Статус:" + Araris.states[Araris.currentState] + "</span><div class = \'dobby_run'\ style = \'position:absolute; left:350px; top:20px;'\></div></div>");
        var table = new west.gui.Table();
        var motivationIcon = '<img src="/images/icons/motivation.png">';
        table.addColumn("jobIcon", "jobIcon")
            .addColumn("jobName", "jobName")
            .addColumn("jobStopMotivation", "jobStopMotivation")
            .addColumn("bestClothes", "jobbestClothesSet")
            .addColumn("jobSet", "jobSet")
            .addColumn("jobRemove", "jobRemove");
        table.appendToCell("head", "jobIcon", "")
            .appendToCell("head", "jobName", "Работа")
            .appendToCell("head", "jobStopMotivation", motivationIcon)
            .appendToCell("head", "bestClothes", "")
            .appendToCell("head", "jobSet", "Шмот")
            .appendToCell("head", "jobRemove", "");
        for (var jobIndex = 0; jobIndex < Araris.addedJobs.length; jobIndex++) {
            var job = Araris.addedJobs[jobIndex];
            table.appendRow().appendToCell(-1, "jobIcon", Araris.getJobIcon(job.silver, job.id, job.x, job.y))
                .appendToCell(-1, "jobName", Araris.getJobName(job.id))
                .appendToCell(-1, "jobStopMotivation", Araris.createMinMotivationTextfield(job))
                .appendToCell(-1, "bestClothes", Araris.createChbEquipBest(job))
                .appendToCell(-1, "jobSet", Araris.createComboxJobSets(job))
                .appendToCell(-1, "jobRemove", Araris.createRemoveJobButton(job));
        }


        var buttonStart = new west.gui.Button("Начать", async function () {
            if (Araris.health == 0) {
                await Araris.equipSet(Araris.jobSet);
                Araris.health = Character.maxHealth;
            }

            var parseSuccesfull = Araris.parseStopMotivation();
            if (parseSuccesfull) {
                Araris.createRoute();
                Araris.isRunning = true;
                Araris.saveData();
                Araris.run();
            } else {
                new UserMessage("Wrong format of set stop motivation", UserMessage.TYPE_ERROR).show();
            }
        });
        var buttonStop = new west.gui.Button("Стоп", function () {
            Araris.isRunning = false;
            Araris.currentState = 0;
            Araris.selectTab("choosenJobs");
        });
        htmlSkel.append(table.getMainDiv());
        if (!Araris.isRunning) {
            $(".dobby_run", footerHtml).append(buttonStart.getMainDiv());
        } else {
            $(".dobby_run", footerHtml).append(buttonStop.getMainDiv());
        }
        htmlSkel.append(footerHtml);
        return htmlSkel;
    };
    Araris.createMinMotivationTextfield = function (job) {
        var componentId = `x-${job.x}y-${job.y}id-${job.id}`;
        var textfield = new west.gui.Textfield();
        textfield.setId(componentId);
        textfield.setWidth(20);
        textfield.setValue(job.stopMotivation);

        return textfield.getMainDiv().append(`<span>/${job.motivation}</span>`);
    };
    Araris.createRemoveJobButton = function (job) {
        var buttonRemove = new west.gui.Button("Убрать", function () {
            Araris.removeJob(job.x, job.y, job.id);
            Araris.addedJobTablePosition.content = $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            Araris.addedJobTablePosition.scrollbar = $(".dobby2window .tw2gui_scrollbar_pulley").css("top");
            Araris.selectTab("choosenJobs");
        });
        buttonRemove.setWidth(100);
        return buttonRemove.getMainDiv();
    };
    Araris.createChbEquipBest = function (job) {
            var checkbox = new west.gui.Checkbox();
            checkbox.setId(job.id);
            checkbox.setSelected(job.equipBestClothes);
            checkbox.setTooltip('Экипировать лучший шмот');
            checkbox.setCallback(function () {
                job.equipBestClothes = this.isSelected();
                Araris.saveTempData();
            });
        return checkbox.getMainDiv();
    };

    Araris.createComboxJobSets = function (job) {
        var combobox = new west.gui.Combobox();
        Araris.addComboboxItems(combobox);
        combobox = combobox.select(Araris.getJobSet(job.x, job.y, job.id));
        combobox.setWidth(60);
        combobox.addListener(function (value) {
            job.setSet(value)
            Araris.selectTab("choosenJobs");
            Araris.saveTempData();
        });
        return combobox.getMainDiv();
    };
    Araris.addComboboxItems = function (combobox) {
        combobox.addItem(-1, "None");
        if (!Araris.sets) return;
        for (var i = 0; i < Araris.sets.length; i++) {
            combobox.addItem(i.toString(), Araris.sets[i].name);
        }
    };
    Araris.createSetGui = function () {
        if (!Araris.sets || Araris.sets.length == 0) {
            return $("<span style=\'font-size:20px'\>No sets available</span>");
        }
        var htmlSkel = $("<div id =\'dobby2_sets_window'\ style=\'display:block;position:relative;width:650px;height:430px;'\><div id=\'dobby2_sets_left' style=\'display:block;position:absolute;width:250px;height:430px;top:0px;left:0px'\></div><div id=\'dobby2_sets_right' style=\'display:block;position:absolute;width:300px;height:410px;top:0px;left:325px'\></div></div>");
        var combobox = new west.gui.Combobox("combobox_sets");
        Araris.addComboboxItems(combobox);
        combobox = combobox.select(Araris.selectedSet);
        combobox.addListener(function (value) {
            Araris.selectedSet = value;
            Araris.selectTab("sets");
        });
        var buttonSelectTravelSet = new west.gui.Button("Сет для передвижения", function () {
            Araris.travelSet = Araris.selectedSet;
            Araris.selectTab("sets");
        });
        var buttonSelectJobSet = new west.gui.Button("Сет для работ", function () {
            Araris.jobSet = Araris.selectedSet;
            Araris.setSetForAllJobs();
            Araris.selectTab("sets");
        });
        var buttonSelectHealthSet = new west.gui.Button("Сет для восстановления хп", function () {
            Araris.healthSet = Araris.selectedSet;
            Araris.selectTab("sets");
        });
        var travelSetText = "None";
        if (Araris.travelSet != -1) {
            travelSetText = Araris.sets[Araris.travelSet].name;
        }
        var jobSetText = "None";
        if (Araris.jobSet != -1) {
            jobSetText = Araris.sets[Araris.jobSet].name;
        }
        var healthSetText = "None";
        if (Araris.healthSet != -1) {
            healthSetText = Araris.sets[Araris.healthSet].name;
        }
        var left = $("<div></div>")
            .append(new west.gui.Groupframe()
                .appendToContentPane($("<span>Шмот</span><br><br>"))
                .appendToContentPane(combobox.getMainDiv())
                .appendToContentPane($("<br><br><span>Сет для передвижения:" + travelSetText + "</span><br><br>"))
                .appendToContentPane(buttonSelectTravelSet.getMainDiv())
                .appendToContentPane($("<br><br><span>Сет для работ:" + jobSetText + "</span><br><br>"))
                .appendToContentPane(buttonSelectJobSet.getMainDiv())
                .appendToContentPane($("<br><br><span>Сет для восстановления хп:" + healthSetText + "</span><br><br>"))
                .appendToContentPane(buttonSelectHealthSet.getMainDiv()).getMainDiv());
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
        var keys = ["head", "body", "pants", "neck", "right_arm", "animal", "yield", "left_arm", "belt", "foot"];
        if (Araris.selectedSet != -1)
            Araris.insertSetImages(right, keys);
        $("#dobby2_sets_left", htmlSkel).append(left);
        $("#dobby2_sets_right", htmlSkel).append(right);
        return htmlSkel;
    };
    Araris.getImageSkel = function () {
        return $("<img src=\''\>");
    };
    Araris.insertSetImages = function (html, keys) {
        for (var i = 0; i < keys.length; i++) {
            if (Araris.sets[Araris.selectedSet][keys[i]] != null) {
                $(".wear_" + keys[i], html).append(Araris.getImageSkel().attr("src", Araris.getItemImage(Araris.sets[Araris.selectedSet][keys[i]])));
            }
        }
        return html;
    };
    Araris.createConsumablesTable = function () {
        var htmlSkel = $("<div id=\'consumables_overview'\></div>");
        var html = $("<div class = \'consumables_filter'\ style=\'position:relative;'\><div id=\'energy_consumables'\ style=\'position:absolute;top:-2px;left:15px;'\></div><div id=\'motivation_consumables'\ style=\'position:absolute;top:19px;left:15px;'\></div><div id=\'health_consumables'\ style=\'position:absolute;top:40px;left:15px;'\></div><div id=\'button_filter_consumables'\ style=\'position:absolute;top:20px;left:150px;'\></div><div id=\'button_tab4'\ style=\'position:absolute;top:20px;left:485px;'\></div></div>");
        var table = new west.gui.Table();
        var motivationIcon = '<img src="/images/icons/motivation.png">';
        var consumableList = Araris.filterConsumables(Araris.consumableSelection.energy, Araris.consumableSelection.motivation, Araris.consumableSelection.health);
        table.addColumn("consumIcon", "consumIcon")
            .addColumn("consumName", "consumName")
            .addColumn("consumCount", "consumCount")
            .addColumn("consumEnergy", "consumEnergy")
            .addColumn("consumMotivation", "consumMotivation")
            .addColumn("consumHealth", "consumHealth")
            .addColumn("consumSelected", "consumSelected");
        table.appendToCell("head", "consumIcon", "")
            .appendToCell("head", "consumName", "Имя")
            .appendToCell("head", "consumCount", "Кол-во")
            .appendToCell("head", "consumEnergy", "Энергия")
            .appendToCell("head", "consumMotivation", motivationIcon)
            .appendToCell("head", "consumHealth", "Хп")
            .appendToCell("head", "consumSelected", "Использовать");
        for (var i = 0; i < consumableList.length; i++) {
            var checkbox = new west.gui.Checkbox();
            checkbox.setId(consumableList[i].id);
            checkbox.setCallback(function () {
                checkbox.setSelected(consumableList[i].selected);
                Araris.changeConsumableSelection(parseInt(this.divMain.attr("id")), this.isSelected());
                Araris.consumableTablePosition.content = $(".dobby2window .tw2gui_scrollpane_clipper_contentpane").css("top");;
                Araris.consumableTablePosition.scrollbar = $(".dobby2window .tw2gui_scrollbar_pulley").css("top");
                Araris.selectTab("consumables");
                Araris.saveData();
            });
            table.appendRow()
                .appendToCell(-1, "consumIcon", Araris.getConsumableIcon(consumableList[i].image))
                .appendToCell(-1, "consumName", consumableList[i].name)
                .appendToCell(-1, "consumCount", consumableList[i].count)
                .appendToCell(-1, "consumEnergy", consumableList[i].energy)
                .appendToCell(-1, "consumMotivation", consumableList[i].motivation)
                .appendToCell(-1, "consumHealth", consumableList[i].health)
                .appendToCell(-1, "consumSelected", checkbox.getMainDiv());
        }
        var buttonSelect = new west.gui.Button("Выбрать все", function () {
            Araris.changeSelectionAllConsumables(true);
            Araris.selectTab("consumables");
            Araris.saveData();
        });
        var buttonDeselect = new west.gui.Button("Убрать все", function () {
            Araris.changeSelectionAllConsumables(false);
            Araris.selectTab("consumables");
            Araris.saveData();
        });
        table.appendToFooter("consumEnergy", buttonSelect.getMainDiv());
        table.appendToFooter("consumHealth", buttonDeselect.getMainDiv());
        htmlSkel.append(table.getMainDiv());
        var checkboxEnergyConsumes = new west.gui.Checkbox();
        checkboxEnergyConsumes.setLabel("Энергия");
        checkboxEnergyConsumes.setSelected(Araris.consumableSelection.energy);
        checkboxEnergyConsumes.setCallback(function () {
            Araris.consumableSelection.energy = this.isSelected();
        });
        var checkboxMotivationConsumes = new west.gui.Checkbox();
        checkboxMotivationConsumes.setLabel("Мотивация");
        checkboxMotivationConsumes.setSelected(Araris.consumableSelection.motivation);
        checkboxMotivationConsumes.setCallback(function () {
            Araris.consumableSelection.motivation = this.isSelected();
        });
        var checkboxHealthConsumes = new west.gui.Checkbox();
        checkboxHealthConsumes.setLabel("Здоровье");
        checkboxHealthConsumes.setSelected(Araris.consumableSelection.health);
        checkboxHealthConsumes.setCallback(function () {
            Araris.consumableSelection.health = this.isSelected();
        });
        var buttonFilter = new west.gui.Button("Фильтр", function () {
            Araris.selectTab("consumables");
        });
        var buttonNext = new west.gui.Button("Дальше", function () {
            Araris.savePermanentData();
            Araris.selectTab("choosenJobs");
        });
        $("#energy_consumables", html).append(checkboxEnergyConsumes.getMainDiv());
        $("#motivation_consumables", html).append(checkboxMotivationConsumes.getMainDiv());
        $("#health_consumables", html).append(checkboxHealthConsumes.getMainDiv());
        $("#button_filter_consumables", html).append(buttonFilter.getMainDiv());
        $("#button_tab4", html).append(buttonNext.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };
    Araris.createSettingsGui = function () {
        var htmlSkel = $("<div id=\'settings_overview'\ style = \'padding:10px;'\></div>");
        var checkboxAddEnergy = new west.gui.Checkbox();
        checkboxAddEnergy.setLabel("Восстанавливать энергию");
        checkboxAddEnergy.setSelected(Araris.settings.addEnergy);
        checkboxAddEnergy.setCallback(function () {
            Araris.settings.addEnergy = !Araris.settings.addEnergy;
        });
        var checkboxAddMotivation = new west.gui.Checkbox();
        checkboxAddMotivation.setLabel("Восстанавливать мотивацию");
        checkboxAddMotivation.setSelected(Araris.settings.addMotivation);
        checkboxAddMotivation.setCallback(function () {
            Araris.settings.addMotivation = !Araris.settings.addMotivation;
        });
        var checkboxAddHealth = new west.gui.Checkbox();
        checkboxAddHealth.setLabel("Восстанавливать здоровье");
        checkboxAddHealth.setSelected(Araris.settings.addHealth);
        checkboxAddHealth.setCallback(function () {
            Araris.settings.addHealth = !Araris.settings.addHealth;
        });
        var htmlHealthStop = $("<div></div>");
        htmlHealthStop.append("<span> % здоровья для остановки работ </span>");
        var healthStopTextfiled = new west.gui.Textfield("healthStop");
        healthStopTextfiled.setValue(Araris.settings.healthStop);
        healthStopTextfiled.setWidth(100);
        htmlHealthStop.append(healthStopTextfiled.getMainDiv());

        var htmlSetWearDelay = $("<div></div>");
        htmlSetWearDelay.append("<span> Пауза перед сменой шмота </span>");
        var setWearDelayTextfiled = new west.gui.Textfield("setWearDelay");
        setWearDelayTextfiled.setValue(Araris.settings.setWearDelay);
        setWearDelayTextfiled.setWidth(100);
        htmlSetWearDelay.append(setWearDelayTextfiled.getMainDiv());

        var htmlJobDelay = $("<div></div>");
        htmlJobDelay.append("<span> Случайная задержка между работами (в секундах) </span>");
        var jobDelayTextFieldMin = new west.gui.Textfield("jobDelay");
        jobDelayTextFieldMin.setValue(Araris.settings.jobDelayMin);
        jobDelayTextFieldMin.setWidth(50);
        var jobDelayTextFieldMax = new west.gui.Textfield("jobDelay");
        jobDelayTextFieldMax.setValue(Araris.settings.jobDelayMax);
        jobDelayTextFieldMax.setWidth(50);

        htmlJobDelay.append(jobDelayTextFieldMin.getMainDiv());
        htmlJobDelay.append("<span> - </span>");
        htmlJobDelay.append(jobDelayTextFieldMax.getMainDiv());

        var htmlRegeneration = $("<div></div>");
        var checkboxEnableRegeneration = new west.gui.Checkbox();
        checkboxEnableRegeneration.setLabel("Спать");
        checkboxEnableRegeneration.setSelected(Araris.settings.enableRegeneration);
        checkboxEnableRegeneration.setCallback(function() {
            Araris.settings.enableRegeneration = !Araris.settings.enableRegeneration;
            if(Araris.settings.enableRegeneration) {
                $("#regeneration_choices_container").css('visibility','visible');
            }else {
                $("#regeneration_choices_container").css('visibility','hidden');
            }
        });

        var sleepPlacesCombobox = new west.gui.Combobox("sleep_places");
        Araris.addSleepPlacesItems(sleepPlacesCombobox);
        sleepPlacesCombobox = sleepPlacesCombobox.select(Araris.settings.selectedSleepPlace || -2);
        sleepPlacesCombobox.addListener(function(value) {
            Araris.settings.selectedSleepPlace = value;
            Araris.selectTab("settings");
        });

        var htmlRegenerationChoices = $("<div id='regeneration_choices_container'></div>");
        htmlRegenerationChoices.css({'display':'inline-block','padding-left':'10px','visibility':(Araris.settings.enableRegeneration)?'visible':"hidden"});
        htmlRegenerationChoices.append($("<span>Место сна: </span>"));
        htmlRegenerationChoices.append(sleepPlacesCombobox.getMainDiv());

        htmlRegeneration.append(checkboxEnableRegeneration.getMainDiv());
        htmlRegeneration.append(htmlRegenerationChoices);

        var buttonApply = new west.gui.Button("Применить", function () {
            Araris.settings.addEnergy = checkboxAddEnergy.isSelected();
            Araris.settings.addMotivation = checkboxAddMotivation.isSelected();
            Araris.settings.addHealth = checkboxAddHealth.isSelected();
            if (Araris.isNumber(healthStopTextfiled.getValue())) {
                var healthStop = parseInt(healthStopTextfiled.getValue());
                healthStop = Math.min(30, healthStop);
                Araris.settings.healthStop = healthStop;
            }
            if (Araris.isNumber(setWearDelayTextfiled.getValue())) {
                var setWearDelay = parseInt(setWearDelayTextfiled.getValue());
                setWearDelay = Math.min(10, setWearDelay);
                Araris.settings.setWearDelay = setWearDelay;
            }
            if (Araris.isNumber(jobDelayTextFieldMin.getValue())) {
                var jobDelayTimeMin = parseInt(jobDelayTextFieldMin.getValue());
                Araris.settings.jobDelayMin = jobDelayTimeMin;
            } else {
                Araris.settings.jobDelayMin = 0;
                Araris.settings.jobDelayMax = 0;
                new UserMessage("Неверный формат минимальной задержки между работами, необходимо число", UserMessage.TYPE_ERROR).show();
            }
            if (Araris.isNumber(jobDelayTextFieldMax.getValue())) {
                var jobDelayTimeMax = parseInt(jobDelayTextFieldMax.getValue());
                Araris.settings.jobDelayMax = jobDelayTimeMax;
            } else {
                Araris.settings.jobDelayMin = 0;
                Araris.settings.jobDelayMax = 0;
                new UserMessage("Неверный формат максимальной задержки между работами, необходимо число", UserMessage.TYPE_ERROR).show();
            }
            Araris.selectTab("settings");
            Araris.savePermanentData();
            new UserMessage("Cохранено", UserMessage.TYPE_SUCCESS).show();
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
    Araris.collectLots = async function() {
        function getUniqueTowns(lots) {
            const townsMap = {};
            lots.forEach(lot => {
                const { market_town_id, market_town_x, market_town_y } = lot;
                if (!townsMap[market_town_id]) {
                    townsMap[market_town_id] = {
                        market_town_id: market_town_id,
                        market_town_x: market_town_x,
                        market_town_y: market_town_y
                    };
                }
            });
            return Object.values(townsMap);
        }

        let lots = (await GameMap.AjaxAsync.remoteCall('building_market', 'fetch_bids')).msg.search_result;
        const towns = getUniqueTowns(lots);

        function calculateDistanceToCharacter(currentPosition, town) {
            const from = { x: currentPosition.x, y: currentPosition.y };
            const to = { x: town.market_town_x, y: town.market_town_y };
            return GameMap.calcWayTime(from, to);
        }

        while (towns.length > 0) {
            let currentPosition = Character.getPosition();
            towns.sort((a, b) =>  calculateDistanceToCharacter(currentPosition, b) - calculateDistanceToCharacter(currentPosition, a));
            Guidepost.start_walk(towns.pop().market_town_id, 'town');
            while (TaskQueue.queue.length > 0) await new Promise(resolve => setTimeout(resolve, 200));
            if (!(await GameMap.AjaxAsync.remoteCall('building_market', 'fetch_town_bids')).error) EventHandler.signal('inventory_changed');;
        }
    };
    Araris.createEventGui = function () {
        var htmlSkel = $("<div id=\'event_overview'\ style = \'padding:10px;'\></div>");
        var buttonCollect = new west.gui.Button("Собрать лоты", function () {
            new UserMessage("Начинаю сбор", UserMessage.TYPE_SUCCESS).show();
            Araris.collectLots();
        });
        htmlSkel.append(buttonCollect.getMainDiv());
        return htmlSkel;
    };
    Araris.createStatisticsGui = function () {
        var htmlSkel = $("<div id=\'statistics_overview'\></div>");
        htmlSkel.append($("<span>Количество работ в текущей сессии: " + Araris.statistics.jobsInSession + "</span><br>"));
        htmlSkel.append($("<span>Опыт в текущей сессии: " + Araris.statistics.xpInSession + "</span><br>"));
        htmlSkel.append($("<span>Вcего работ: " + Araris.statistics.totalJobs + "</span><br>"));
        htmlSkel.append($("<span>Всего опыт: " + Araris.statistics.totalXp + "</span><br>"));
        return htmlSkel;
    };
    Araris.createMenuIcons = function () {
        var menuimage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACNklEQVR4nO3TS2sTURQH8MGNIEJ9ZO40JSKKIu4EwY3FSsEmaafGTEhdVF24FkS/QL5BJW3SZDJz72SSeaSxmUeSZkZduBFEcFPciSDaIohCtQtrm8WRCKVNsGnrZNn/+tzfOZx7L0UdxEtyylNHVCo/sGYA0YxVrJuLWLdMohqPiW6e8t6gWAlgzbiDdSNLdGs5P2eDVLKB6BZg1WiKSqUoatZAI4om3ciAt4aJROKQXK4O5ktVSdLNJtFMEFUDhLz6W7s/CDWW/mh6bbIZrM6fxUrFFNUKCMo8CLIOyr2rYIXQJNWLNELnDjsxxlAexUGUS8AXypARC2uCoDGe8SrrP+LGkNuIIqiPI5AfTgAvz0E2X4JZSSOe8JeRvmNODL1q4Qs3EdRZBPYoY2SlUi2T1yGN1XWeL/r/C3fjgRMOR7/ZjlfD9IvWujJEPT8rac00USElFB7sG3eiPr8To9914K/LQ/TRzZo00ZQ0ViElFsv7wp/FmTNuDH3owBfrY33Ht9elsTqUEhWYEQpv94w/v91/0eXQctvOQ+i9PYyYf/2TGaHwZZqXV/Y4ue+yy9HfOib/XB/tP73TmemcLCSz0vru+ITvmsuhnx34Vyt48kK3c0leuvskS753xZ24b8zl6F9teAitmDfoS7sNlszlAlMZ0ugyOTPucGijA181RpgrVC/icPSntgsN02tmkLlO9SoLt9DS1s7Rhj3CsD3D/zZgfeEai5Zar8UOokhP8YNQO+QPwxRBhVw3DtYAAAAASUVORK5CYII=';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=GameMap.Araris.loadJobs(); title="Araris" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };


    $(document).ready(function () {
        Araris.injectBag();
        Araris.loadLanguage();
        Araris.loadData();
        Araris.createMenuIcons();
    });
})();
