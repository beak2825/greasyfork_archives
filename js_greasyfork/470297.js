// ==UserScript==
// @name         PizzaHut
// @namespace    http://tampermonkey.net/
// @version      1.30
// @description  pizzahut
// @author       RockefelleR
// @include https://*.the-west.*/game.php*
// @icon         data:image/png;base64,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dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDozOGI0NTFjNS0xYWU3LTRiMTgtOTc0Zi1mZGM5ODM1MDY0NzkiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDcxYTlkMWMtYmRiMS00OGY1LTgzYTgtN2IyNDE0MTg0MjIwIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YzY1NTNlYjEtYjk0OS00YzhkLWJjYWMtZWI5NDc3MWIxZDJhIgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE2ODg2NzUwNjA3NzI2NjEiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zMiIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjM6MDc6MDZUMjI6MjQ6MTkrMDI6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIzOjA3OjA2VDIyOjI0OjE5KzAyOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MGRlNWIxNTQtMDFhYy00OGZmLTg4NDktMDM4ZGZhYWMzYjFlIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTA3LTA2VDIyOjI0OjIwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PpUJUyMAAAAGYktHRAD6AP8A/2hdKOMAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwYUGBTTMEXeAAAEoklEQVRYw+1Wa2wUVRQ+987szOzu7Ktlt8D2XftaurttqY2RRkuhASIJD6khiMSQiK2PkFhRSYxg+KNJkSDFEEiMTXz+UIloSgyyLW+MUNquUkrb7YOw3W330dLdmd2dmesPaWKwyFoa9Ue/5P645365+XK+c889APOYx38MlCwxVLv6GMTi25MiM8wx06mT9clQcTKkye0vmCCRePYu/8GLkOcmd72pmzMB8vDwFlCIOum8JhIapdu99aEFRA8cRKGVqzaCrOz+p94SSX4rvHrthlnVwOSO+lRlPLCDTEXqQRQzH67KUB9Sqw/jNEuLvuXj0N8KCNdtLiaB4E5QlG2gKOo5LXeaFgCgBdHUAeOPrb1/ETCxddsmZfhW3b/y9FJMnxiPf916XwveaHzd5PV6rZIkQSKRgKzsbGH/gQ/6a6qrK4Wo8D7GuOn8pYs/zEliZgp+f+JEZSwWOwkAwLDsNx1Xr24sczgvKAr5EFPYTtN05pw5M1NQbzCMj/n9AABwvffG0xXl5b+FAsHH9Qb9rdHbXq+tpET/SHZON8uyvaIoFgAAqDWaS4l4PF+SJAIACwxG42WKpsplSZLj8bjFkpb26um2tu9m1QcMBuMEAIBv1BcCgBKOY7MNJqNLbzRc+GPPneM4zu8sLX2FoqhSlmWti62LWxctXHTJmp6xW4gKmbFYfEvSGfgzHquszBv1eh0IIVGn07mCgcCLhBBCZOWgf9TXpWKY22vWrt3dtL8pHIvFjsuybLRmpD8/5h9jwuHwMzRN6xDGoCgymlUnFKLCBlOK6WyRzbZ+zO/vm348lIpuAQDNAvOChqb9TWF7sa0uGomsYxim1dXe3jI+NtYoS1Kqw+l8FwgBQggz0/3UTMF0q3VxNBLZgRCC6703Vg2PjHzae/Nmf0XFo7UAkB+ZmtIm4okUhmW1FEVBUUHhAELoHVlRVDq9HjKsVsLzujMcx9lvjQw/qaJVboSxeXn18i+73e7EAy3g1JwFAIAQArU1K9J7e3rWAEIgCkJ/OBh8SZLlIgCAzKysNoqi9g16PJ1Gk7HTkmbZiDGVPzI01KzRahWMUfOvPT17pu+90tGRnAV6veEaz/MVPM9XsCw7pWKYBpqmj965M+kotBVn0DR9lFNzezbV1fW1nT2zubxiaZHd4Vzham//+SfX6c+qa2pyzGbzsqudnXvmZB7Iy8r+BQCWAkD9sqqq0Plz577CGLtvegbs93KL8ws0GOMWURTf6x8avDLr3/CJqqqV98a0PF/r8/memt4vLS37qKTY1rVh3frcUrujzbFkSSenVn8uiuImjVaz9+X6en7WAibC4S+cS0o8+Tm5VwDABgDAsqwvHA4FpznB8XEsRKN2QojpzuQkLwqiIzcvrwMAIBqJ7j185MjUrAWYzeYay8K0ZrVGsw8hNAgAEAwEugoKCy/O6Sd5v4NTLlc3AHTfrYG3Zxw6pnuFEFVjjLUAALIkJQAACouLUvqHBh9+JNv1WqMaISQAgDsjMzPVM+DhAcCNMY45y0ov8zpdZHDA8y2tUnllWXb39fVdY1k26hv17Ww+dKhhfu6fx/8evwMiLszqFMOGnQAAAABJRU5ErkJggg==
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/470297/PizzaHut.user.js
// @updateURL https://update.greasyfork.org/scripts/470297/PizzaHut.meta.js
// ==/UserScript==

(function () {

    function JobPrototype(x, y, id) {
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
        setSilver: function (isSilver) {
            this.silver = isSilver;
        },
        calculateDistance: function () {
            this.distance = Map.calcWayTime({ x: this.x, y: this.y }, Character.position);
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
        }
    };
    function ConsumablePrototype(id, image, name) {
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
        }
    };


    PizzaHut = {
        window: null,
        jobsLoaded: false,
        allJobs: [],
        allConsumables: [],
        consumableUsed: [],
        addedJobs: [],
        jobFilter: { filterOnlySilver: false, filterNoSilver: false, filterCenterJobs: false, filterJob: "" },
        sortJobTableXp: 0,
        sortJobTableDistance: 0,
        jobTablePosition: { content: "0px", scrollbar: "0px" },
        addedJobTablePosition: { content: "0px", scrollbar: "0px" },
        consumableTablePosition: { content: "0px", scrollbar: "0px" },
        standsJob: 0,
        currentState: 0,
        states: ["idle", "running", "waiting for a consumable cooldown"],
        sets: null,
        selectedSet: 0,
        travelSet: -1,
        jobSet: -1,
        pointsSet: -1,
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
            "sk_SK": {
                energy: "Energia",
                energyText: "Zvýšenie energie:",
                motivation: "Pracovnej motivácie",
                motivationText: "Zvýšenie pracovnej motivácie:",
                health: "Bonus bodov zdravia",
                healthText: "Bonus bodov zdravia:"
            },
            "cs_CZ": {
                energy: "Energie",
                energyText: "Zvýšení energie:",
                motivation: "Pracovní motivace",
                motivationText: "Zvýšení pracovní motivace:",
                health: "Bonus zdraví",
                healthText: "Bonus zdraví:"
            },
            "hu_HU": {
                energy: "Energia növekedése:",
                energyText: "Energia növekedése:",
                motivation: "Munka motiváció növelése:",
                motivationText: "Munka motiváció növelése:",
                health: "Életerő bónusz",
                healthText: "Életerő bónusz:"
            },
            "pl_PL": {
                energy: "Wzrost energii:",
                energyText: "Wzrost energii:",
                motivation: "Zwiększenie motywacji do pracy:",
                motivationText: "Zwiększenie motywacji do pracy:",
                health: "Bonus Punktów życia:",
                healthText: "Bonus Punktów życia:"
            },
            "ro_RO": {
                energy: "Energie mărită:",
                energyText: "Energie mărită:",
                motivation: "Creştere a motivaţiei de muncă:",
                motivationText: "Creştere a motivaţiei de muncă:",
                health: "Puncte de viaţă:",
                healthText: "Puncte de viaţă:"
            },


        },
        AktualnyX: '',
        AktualnyY: '',
        consumableSelection: { energy: false, motivation: false, health: false },
        isRunning: false,
        currentJob: { job: 0, direction: true },
        jobRunning: false,
        autoRefresh: false,
        settings: {
            addEnergy: false,
            addMotivation: false,
            addHealth: false,
            betterWork: false,
            healthStop: 25,
            setWearDelay: 2,
            jobDelayMin: 5,
            jobDelayMax: 10
        },
        statistics: {
            jobsInSession: 0,
            xpInSession: 0,
            totalJobs: 0,
            totalXp: 0,
        }
    };
    PizzaHut.isNumber = function (potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };

    PizzaHut.generateRandomNumber = function (min, max) {
        var minN = Math.min(min, max);
        var maxN = Math.max(min, max);

        var number = Math.floor((minN + Math.random() * (maxN - minN + 1)));
        //console.log("Generated job set delay is :" + number + " seconds");
        return number;
    }

    PizzaHut.loadJobs = function () {
        if (!PizzaHut.jobsLoaded) {
            new UserMessage("Placuszek, juz sie grzeje silaczu", UserMessage.TYPE_HINT).show();
            var tiles = [];
            var index = 0;
            var currentLength = 0;
            var maxLength = 299;
            Ajax.get('map', 'get_minimap', {}, function (r) {
                var tiles = [];
                var jobs = [];
                for (var jobGroup in r.job_groups) {
                    var group = r.job_groups[jobGroup];
                    var jobsGroup = JobList.getJobsByGroupId(parseInt(jobGroup));
                    for (var tilecoord = 0; tilecoord < group.length; tilecoord++) {
                        var xCoord = Math.floor(group[tilecoord][0] / Map.tileSize);
                        var yCoord = Math.floor(group[tilecoord][1] / Map.tileSize);
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
                            jobs.push(new JobPrototype(group[tilecoord][0], group[tilecoord][1], jobsGroup[i].id));
                        }
                    }
                }
                var toLoad = tiles.length;
                var loaded = 0;
                for (var blocks = 0; blocks < tiles.length; blocks++) {
                    Map.Data.Loader.load(tiles[blocks], function () {
                        loaded++;
                        if (loaded == toLoad) {
                            PizzaHut.jobsLoaded = true;
                            PizzaHut.allJobs = jobs;
                            PizzaHut.findAllConsumables();
                            PizzaHut.createWindow();
                        }
                    });
                }
            });
        } else {
            PizzaHut.findAllConsumables();
            PizzaHut.createWindow();
        }
    };
    PizzaHut.loadJobData = function (callback) {
        Ajax.get('work', 'index', {}, function (r) {
            if (r.error) {
                //console.log(r.error);
                return;
            }
            JobsModel.initJobs(r.jobs);
            callback();
        });
    };
    PizzaHut.loadSets = function (callback) {
        Ajax.remoteCallMode('inventory', 'show_equip', {}, function (r) {
            PizzaHut.sets = r.data;
            callback();
        });
    };
    PizzaHut.loadLanguage = function () {
        Ajax.remoteCall("settings", "settings", {}, function (resp) {
            PizzaHut.language = resp.lang.account.key;
        });
    };
    PizzaHut.loadJobMotivation = function (index, callback) {
        Ajax.get('job', 'job', { jobId: PizzaHut.addedJobs[index].id, x: PizzaHut.addedJobs[index].x, y: PizzaHut.addedJobs[index].y }, function (r) {
            callback(r.motivation * 100);
        });
    };
    PizzaHut.getJobName = function (id) {
        return JobList.getJobById(id).name;
    };
    PizzaHut.getJobIcon = function (silver, id, x, y) {
        var html = '<div class="centermap" onclick="Map.center(' + x + ',' + y + ');"style="position: absolute;background-image: url(\'../images/map/icons/instantwork.png\');width: 20px;height: 20px;top: 0;right: 3px;cursor: pointer;"></div>';
        var silverHtml = "";
        if (silver) {
            silverHtml = '<div class="featured silver"></div>';
        }
        return '<div class="job" style="left: 0; top: 0; position: relative;"><div  onclick="" class="featured"></div>' + silverHtml + html + '<img src="../images/jobs/' + JobList.getJobById(id).shortname + '.png" class="job_icon"></div>';
    };
    PizzaHut.getConsumableIcon = function (src) {
        return "<div><img src =" + src + "></div>";
    };
    PizzaHut.checkIfSilver = function (x, y, id) {
        var key = x + "-" + y;
        var jobData = Map.JobHandler.Featured[key];
        if (jobData == undefined || jobData[id] == undefined) {
            return false;
        } else {
            return jobData[id].silver;
        }
    };
    PizzaHut.compareUniqueJobs = function (job, jobs) {
        for (var i = 0; i < jobs.length; i++) {
            if (jobs[i].id == job.id) {
                if (job.silver && !jobs[i].silver || job.distance < jobs[i].distance) {
                    jobs.splice(i, 1);
                    jobs.push(job);
                }
                return;
            }
        }
        jobs.push(job);
    };
    PizzaHut.findJobData = function (job) {
        for (var i = 0; i < JobsModel.Jobs.length; i++) {
            if (JobsModel.Jobs[i].id == job.id) {
                return JobsModel.Jobs[i];
            }
        }
    };
    PizzaHut.parseJobData = function (jobs) {
        for (var job = 0; job < jobs.length; job++) {
            var currentJob = jobs[job];
            var data = PizzaHut.findJobData(currentJob);
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
    PizzaHut.getAllUniqueJobs = function () {
        var jobs = [];
        for (var i = 0; i < PizzaHut.allJobs.length; i++) {
            var currentJob = PizzaHut.allJobs[i];
            if (PizzaHut.jobFilter.filterJob != "") {
                if (!PizzaHut.getJobName(currentJob.id).toLowerCase().includes(PizzaHut.jobFilter.filterJob)) {
                    continue;
                }
            }
            if (!JobList.getJobById(currentJob.id).canDo()) {
                continue;
            }
            if (PizzaHut.checkIfJobAdded(currentJob.id)) {
                continue;
            }
            var isSilver = PizzaHut.checkIfSilver(currentJob.x, currentJob.y, currentJob.id);
            currentJob.silver = isSilver;
            currentJob.calculateDistance();
            if (isSilver && PizzaHut.jobFilter.filterNoSilver) {
                continue;
            }
            if (!isSilver && PizzaHut.jobFilter.filterOnlySilver) {
                continue;
            }
            if (PizzaHut.jobFilter.filterCenterJobs && currentJob.id < 131) {
                continue;
            }
            PizzaHut.compareUniqueJobs(currentJob, jobs);
        }
        PizzaHut.parseJobData(jobs);

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
        if (PizzaHut.sortJobTableXp == 1) {
            jobs.sort(experienceSort);
        }
        if (PizzaHut.sortJobTableXp == -1) {
            jobs.sort(reverseExperienceSort);
        }
        if (PizzaHut.sortJobTableDistance == 1) {
            jobs.sort(distanceSort);
        }
        if (PizzaHut.sortJobTableDistance == -1) {
            jobs.sort(reverseDistanceSort);
        }
        return jobs;
    };
    PizzaHut.findJob = function (x, y, id) {
        for (var i = 0; i < PizzaHut.allJobs.length; i++) {
            if (PizzaHut.allJobs[i].id == id && PizzaHut.allJobs[i].x == x && PizzaHut.allJobs[i].y == y) {
                return PizzaHut.allJobs[i];
            }
        }
    };
    PizzaHut.addJob = function (x, y, id) {
        if (!PizzaHut.checkIfJobAdded(id)) {
            PizzaHut.addedJobs.push(PizzaHut.findJob(x, y, id));
            //console.log("X job:" + x);
            //console.log("Y job:" + y);
            //console.log("ID job:" + id);
        }
    };
    PizzaHut.removeJob = function (x, y, id) {
        for (var i = 0; i < PizzaHut.addedJobs.length; i++) {
            if (PizzaHut.addedJobs[i].id == id && PizzaHut.addedJobs[i].x == x && PizzaHut.addedJobs[i].y == y) {
                PizzaHut.addedJobs.splice(i, 1);
                PizzaHut.consolidePosition(i);
                break;
            }
        }
    };
    PizzaHut.checkIfJobAdded = function (id) {
        for (var i = 0; i < PizzaHut.addedJobs.length; i++) {
            if (PizzaHut.addedJobs[i].id == id) {
                return true;
            }
        }
        return false;
    };
    PizzaHut.findAddedJob = function (x, y, id) {
        for (var i = 0; i < PizzaHut.addedJobs.length; i++) {
            if (PizzaHut.addedJobs[i].x == x && PizzaHut.addedJobs[i].y == y && PizzaHut.addedJobs[i].id == id) {
                return PizzaHut.addedJobs[i];
            }
        }
        return null;
    };

    PizzaHut.consolidePosition = function (removeIndex) {
        if (removeIndex <= PizzaHut.currentJob.job && PizzaHut.currentJob.job > 0) {
            PizzaHut.currentJob.job--;
        }
        if (PizzaHut.addedJobs.length == 1) {
            PizzaHut.currentJob.direction = true;
        }
    }
    PizzaHut.parseStopMotivation = function () {
        for (var i = 0; i < PizzaHut.addedJobs.length; i++) {
            var stopMotivation = $(".PizzaHut2window #x-" + PizzaHut.addedJobs[i].x + "y-" + PizzaHut.addedJobs[i].y + "id-" + PizzaHut.addedJobs[i].id).prop("value");
            if (PizzaHut.isNumber(stopMotivation)) {
                PizzaHut.addedJobs[i].setStopMotivation(parseInt(stopMotivation));
            } else {
                return false;
            }
        }
        return true;
    };
    PizzaHut.getItemImage = function (id) {
        return ItemManager.get(id).wear_image;
    };
    PizzaHut.findAllConsumables = function () {
        if (PizzaHut.searchKeys[PizzaHut.language] == undefined) return;
        var energyConsumes = Bag.search(PizzaHut.searchKeys[PizzaHut.language].energy);
        for (var i = 0; i < energyConsumes.length; i++) {
            PizzaHut.addConsumable(energyConsumes[i]);
        }
        var motivationConsumes = Bag.search(PizzaHut.searchKeys[PizzaHut.language].motivation);
        for (var i = 0; i < motivationConsumes.length; i++) {
            PizzaHut.addConsumable(motivationConsumes[i]);
        }
        var healthConsumes = Bag.search(PizzaHut.searchKeys[PizzaHut.language].health);
        for (var i = 0; i < healthConsumes.length; i++) {
            PizzaHut.addConsumable(healthConsumes[i]);
        }
    };
    PizzaHut.CheckIfConsumableAdded = function (item) {
        if (item == undefined)
            return true;
        for (var i = 0; i < PizzaHut.allConsumables.length; i++) {
            if (PizzaHut.allConsumables[i].id == item.obj.item_id) {
                return true;
            }
        }
        return false;
    };
    PizzaHut.addConsumable = function (item) {
        if (PizzaHut.CheckIfConsumableAdded(item)) {
            return;
        }
        var consumable = new ConsumablePrototype(item.obj.item_id, item.obj.image, item.obj.name);
        var bonuses = PizzaHut.parseConsumableBonuses(item.obj.usebonus);
        if (bonuses[0] == 0 && bonuses[1] == 0 && bonuses[2] == 0)
            return;
        consumable.setEnergy(bonuses[0]);
        consumable.setMotivation(bonuses[1]);
        consumable.setHealth(bonuses[2]);
        consumable.setCount(item.count);
        PizzaHut.allConsumables.push(consumable);
    };
    PizzaHut.removeConsumable = function (item) {
        var index;
        for (var i = 0; i < PizzaHut.allConsumables.length; i++) {
            if (PizzaHut.allConsumables[i].id == item.id) {
                index = i;
                break;
            }
        }
        if (index != undefined) {
            if (PizzaHut.allConsumables[index].count > 1) {
                PizzaHut.allConsumables[index].count--;
            } else {
                PizzaHut.allConsumables.slice(index, 1);
            }
        }
    };
    PizzaHut.parseConsumableBonuses = function (bonuses) {
        var getBonus = function (text, type) {
            switch (type) {
                case 0:
                    text = text.replace(PizzaHut.searchKeys[PizzaHut.language].energyText, "");
                    break;
                case 1:
                    text = text.replace(PizzaHut.searchKeys[PizzaHut.language].motivationText, "")
                    break;
                case 2:
                    text = text.replace(PizzaHut.searchKeys[PizzaHut.language].healthText, "");
                    break;
            }
            text = text.slice(1);
            text = text.replace("%", "");
            return parseInt(text);
        }
        var result = Array(3).fill(0);
        for (var i = 0; i < bonuses.length; i++) {
            var type = -1;
            if (bonuses[i].includes(PizzaHut.searchKeys[PizzaHut.language].energyText)) {
                type = 0;
            } else if (bonuses[i].includes(PizzaHut.searchKeys[PizzaHut.language].motivationText)) {
                type = 1;
            } else if (bonuses[i].includes(PizzaHut.searchKeys[PizzaHut.language].healthText)) {
                type = 2;
            }
            if (type != -1)
                result[type] = getBonus(bonuses[i], type);

        }
        return result;
    };
    PizzaHut.filterConsumables = function (energy, motivation, health) {
        var result = [];
        for (var i = 0; i < PizzaHut.allConsumables.length; i++) {
            if (energy && PizzaHut.allConsumables[i].energy == 0) {
                continue;
            }
            if (motivation && PizzaHut.allConsumables[i].motivation == 0) {
                continue;
            }
            if (health && PizzaHut.allConsumables[i].health == 0) {
                continue;
            }
            result.push(PizzaHut.allConsumables[i]);
        }
        return result;
    };
    PizzaHut.changeConsumableSelection = function (id, selected) {
        for (var i = 0; i < PizzaHut.allConsumables.length; i++) {
            if (PizzaHut.allConsumables[i].id == id) {
                PizzaHut.allConsumables[i].setSelected(selected);
                break;
            }
        }
    };
    PizzaHut.changeSelectionAllConsumables = function (selected) {
        for (var i = 0; i < PizzaHut.allConsumables.length; i++) {
            PizzaHut.allConsumables[i].setSelected(selected);
        }
    };
    PizzaHut.canUseConsume = function (item) {
        if (BuffList.cooldowns[item.id] != undefined && BuffList.cooldowns[item.id].time > new ServerDate().getTime()) {
            return false;
        }
        return true;
    };
    PizzaHut.useConsumable = async function (itemToUse) {
        var item = Bag.getItemByItemId(itemToUse.id);
        item.showCooldown();
        PizzaHut.currentState = 2;
        PizzaHut.selectTab("choosenJobs");
        while (true) {
            if (PizzaHut.canUseConsume(itemToUse)) {
                if (PizzaHut.healthSet != -1 && (26 >= ((Character.health / Character.maxHealth) * 100))) {
                    //console.log("Stage 0");
                    PizzaHut.equipSet(PizzaHut.healthSet);
                    await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1000));
                }
                PizzaHut.removeConsumable(itemToUse);
                PizzaHut.consumableUsed.push(itemToUse);
                ItemUse.doIt(itemToUse.id);
                if (PizzaHut.jobSet != -1 && (26 >= ((Character.health / Character.maxHealth) * 100))) {
                    PizzaHut.equipSet(PizzaHut.jobSet);
                    await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1000));
                }
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        while (true) {
            if (!PizzaHut.canUseConsume(itemToUse)) {
                $(".tw2gui_dialog_framefix").remove();
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        PizzaHut.run();
    };


    PizzaHut.useConsumableEnergry = async function (itemToUse) {
        var item = Bag.getItemByItemId(itemToUse.id);
        item.showCooldown();
        PizzaHut.selectTab("choosenJobs");

        if (PizzaHut.canUseConsume(itemToUse)) {
            PizzaHut.removeConsumable(itemToUse);
            PizzaHut.consumableUsed.push(itemToUse);
            ItemUse.doIt(itemToUse.id);
            await new Promise(r => setTimeout(r, 1));
        }


        if (!PizzaHut.canUseConsume(itemToUse)) {
            $(".tw2gui_dialog_framefix").remove();
            await new Promise(r => setTimeout(r, 1));
        }
    };

    PizzaHut.useConsumableHp = async function (itemToUse) {
        var item = Bag.getItemByItemId(itemToUse.id);
        item.showCooldown();
        PizzaHut.currentState = 2;
        PizzaHut.selectTab("choosenJobs");

        if (PizzaHut.canUseConsume(itemToUse)) {
            if (PizzaHut.healthSet != -1) {
                //console.log("Stage 0");
                PizzaHut.equipSet(PizzaHut.healthSet);
                await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1000));
            }
            PizzaHut.removeConsumable(itemToUse);
            PizzaHut.consumableUsed.push(itemToUse);
            ItemUse.doIt(itemToUse.id);
            if (PizzaHut.jobSet != -1) {
                await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 500));
                PizzaHut.equipSet(PizzaHut.jobSet);
                await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1000));
            }
            await new Promise(r => setTimeout(r, 1));
        }


        if (!PizzaHut.canUseConsume(itemToUse)) {
            $(".tw2gui_dialog_framefix").remove();
            await new Promise(r => setTimeout(r, 1));
        }

    };


    PizzaHut.findProperConsumableHp = function (healthMissing, consumables) {
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
        return findHealthConsume(consums);
    };






    PizzaHut.findProperConsumable = function (motivationMissing, energyMissing, healthMissing, averageMotivationMissing, consumables) {
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
        if (motivationMissing == PizzaHut.addedJobs.length) {
            // TUTAJ
            return findMotivationConsume(consums);
        }
        if (PizzaHut.isHealthBelowLimit()) {
            return findHealthConsume(consums);
        }
    };

    PizzaHut.equipSet = async function (set) {
        if (set == -1) return true;
        //console.log("Stage 1");
        EquipManager.switchEquip(PizzaHut.sets[set].equip_manager_id);
        while (true) {
            //console.log("Stage 2");
            let finished = await PizzaHut.isGearEquiped(PizzaHut.getSetItemArray(PizzaHut.sets[set]));
            if (finished) break;
            await new Promise(r => setTimeout(r, 1));
        }
        return Promise.resolve(true);
    };



    PizzaHut.findEnergry1 = function (energyMissing, consumables) {
        var betterEnergy = function (item1, item2) {
            var distanceItem1 = Math.abs(item1.energy);
            var distanceItem2 = Math.abs(item2.energy);
            return (distanceItem1 > distanceItem2) ? -1 : (distanceItem1 < distanceItem2) ? 1 : 0;
        };

        if (consumables.length == 0) return null;
        var consums = consumables;
        consums = consums.sort(betterEnergy);
        return consums[0];
    };

    PizzaHut.findEnergry0 = function (energyMissing, consumables) {
        var betterEnergy = function (item1, item2) {
            var distanceItem1 = Math.abs(item1.energy);
            var distanceItem2 = Math.abs(item2.energy);
            return (distanceItem1 > distanceItem2) ? -1 : (distanceItem1 < distanceItem2) ? 1 : 0;
        };

        if (consumables.length == 0) return null;
        var consums = consumables;
        consums = consums.sort(betterEnergy);
        return consums[0];
    };




    PizzaHut.tryUseConsumable = function (result) {
        var healthMissing = 100 - (Character.health / Character.maxHealth) * 100;
        var energyMissing = 100 - (Character.energy / Character.maxEnergy) * 100;
        var motivationMissing = PizzaHut.jobsBelowMotivation(result);
        var consumables = PizzaHut.allConsumables;
        var averageMotivationMissing = PizzaHut.averageMissingMotivation(result);
        var selectedConsumes = [];
        for (var i = 0; i < consumables.length; i++) {
            if (consumables[i].selected)
                selectedConsumes.push(consumables[i]);
        }
        var itemToUse = PizzaHut.findProperConsumable(motivationMissing, energyMissing, healthMissing, averageMotivationMissing, selectedConsumes);
        if (itemToUse == null) return false;
        PizzaHut.useConsumable(itemToUse);

        PizzaHut.currentJob.job = 0;
        PizzaHut.currentJob.direction = true;


        return true;
    };

    PizzaHut.tryUseEnergy1 = function () {
        var energyMissing = 100 - (Character.energy / Character.maxEnergy) * 100;
        var consumables = PizzaHut.allConsumables;
        var selectedConsumes = [];
        for (var i = 0; i < consumables.length; i++) {
            if (consumables[i].selected)
                selectedConsumes.push(consumables[i]);
        }
        var itemToUse = PizzaHut.findEnergry1(energyMissing, selectedConsumes);
        PizzaHut.useConsumableEnergry(itemToUse);

    };

    PizzaHut.tryUseHp = function () {
        var healthMissing = 100 - (Character.health / Character.maxHealth) * 100;
        var consumables = PizzaHut.allConsumables;
        var selectedConsumes = [];
        for (var i = 0; i < consumables.length; i++) {
            if (consumables[i].selected)
                selectedConsumes.push(consumables[i]);
        }
        var itemToUse = PizzaHut.findProperConsumableHp(healthMissing, selectedConsumes);
        PizzaHut.useConsumableHp(itemToUse);
    };





    PizzaHut.calculateDistances = function () {
        for (var i = 0; i < PizzaHut.addedJobs.length; i++) {
            PizzaHut.addedJobs[i].calculateDistance();
        }
    };
    PizzaHut.createDistanceMatrix = function () {


        var distances = new Array(PizzaHut.addedJobs.length);


        for (var i = 0; i < distances.length; i++) {
            distances[i] = new Array(PizzaHut.addedJobs.length);
        }
        for (var i = 0; i < distances.length; i++) {
            for (var j = i; j < distances[i].length; j++) {
                if (i == j) {
                    distances[i][j] = distances[j][i] = Number.MAX_SAFE_INTEGER;
                    continue;
                }
                distances[i][j] = distances[j][i] = Map.calcWayTime({ x: PizzaHut.addedJobs[i].x, y: PizzaHut.addedJobs[i].y }, { x: PizzaHut.addedJobs[j].x, y: PizzaHut.addedJobs[j].y });
            }
        }
        return distances;
    };
    PizzaHut.createRoute = function () {
        PizzaHut.currentJob.job = 0;
        PizzaHut.calculateDistances();
        var closestJobIndex = 0;
        var closestDistance = PizzaHut.addedJobs[0].distance;
        var route = [];
        var distances = PizzaHut.createDistanceMatrix();
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



        for (var i = 1; i < PizzaHut.addedJobs.length; i++) {
            if (PizzaHut.addedJobs[i].distance <= closestDistance) {
                closestDistance = PizzaHut.addedJobs[i].distance;
                closestJobIndex = i;

            }
        }
        route.push(closestJobIndex);
        while (route.length < PizzaHut.addedJobs.length) {
            var closestJob = getClosestJob(route[route.length - 1], route, distances);
            route.push(closestJob);
        }
        var addedJobsOrder = [];



        for (var i = 0; i < route.length; i++) {

            addedJobsOrder.push(PizzaHut.addedJobs[route[i]]);
        }
        PizzaHut.addedJobs = addedJobsOrder;
        PizzaHut.selectTab("choosenJobs");
    };

    PizzaHut.getSetItemArray = function (set) {
        var items = [];
        if (set.head != null)
            items.push(set.head);
        if (set.neck != null)
            items.push(set.neck);
        if (set.body != null)
            items.push(set.body);
        if (set.right_arm != null)
            items.push(set.right_arm);
        if (set.left_arm != null)
            items.push(set.left_arm);
        if (set.belt != null)
            items.push(set.belt);
        if (set.foot != null)
            items.push(set.foot);
        if (set.animal != null)
            items.push(set.animal);
        if (set.yield != null)
            items.push(set.yield);
        if (set.pants != null)
            items.push(set.pants);
        return items;
    };
    PizzaHut.isWearing = function (itemId) {
        if (Wear.wear[ItemManager.get(itemId).type] == undefined) return false;
        return Wear.wear[ItemManager.get(itemId).type].obj.item_id == itemId;
    };
    PizzaHut.isGearEquiped = async function (items) {
        for (var i = 0; i < items.length; i++) {
            if (!PizzaHut.isWearing(items[i])) return false;
        }
        return true;
    }


    PizzaHut.checkMotivation = function (index, result, callback) {
        var check = function (index, result) {
            PizzaHut.loadJobMotivation(index, function (motivation) {
                result.push(motivation);
                if (index + 1 < PizzaHut.addedJobs.length) {
                    check(++index, result);
                } else
                    if (index + 1 == PizzaHut.addedJobs.length) {
                        callback(result);
                        return;
                    }
            });
        };
        check(0, result);
    };
    PizzaHut.isMotivationAbove = function (result) {
        for (var i = 0; i < result.length; i++) {
            if (result[i] > PizzaHut.addedJobs[i].stopMotivation) {
                return true;
            }
        }
        return false;
    };
    PizzaHut.jobsBelowMotivation = function (result) {
        var count = 0;
        for (var i = 0; i < result.length; i++) {
            if (result[i] <= PizzaHut.addedJobs[i].stopMotivation) {
                count++;
            }
        }
        return count;
    };
    PizzaHut.averageMissingMotivation = function (result) {
        var motivation = 0;
        for (var i = 0; i < result.length; i++) {
            motivation += (100 - result[i]);
        }
        return motivation / result.length;
    };
    PizzaHut.isHealthBelowLimit = function () {
        if (PizzaHut.settings.healthStop >= ((Character.health / Character.maxHealth) * 100)) {
            return true;
        }
        return false;
    };
    PizzaHut.isStopMotivationZero = function () {
        for (var i = 0; i < PizzaHut.addedJobs.length; i++) {
            if (PizzaHut.addedJobs[i].stopMotivation == 0) {
                return true;
            }
        }
        return false;
    };
    PizzaHut.canAddMissing = function (result) {
        if (!PizzaHut.settings.addMotivation && PizzaHut.jobsBelowMotivation(result) && !PizzaHut.isStopMotivationZero()) {
            alert("Can't continue because of motivationM");
            return false;
        }
        if (!PizzaHut.settings.addEnergy && Character.energy == 0) {
            alert("Can't continue because of energyM");
            return false;
        }
        if (!PizzaHut.settings.addHealth && PizzaHut.isHealthBelowLimit()) {
            alert("Can't continue because of healthM");
            return false;
        }
        return true;
    };
    PizzaHut.finishRun = function () {
        PizzaHut.currentState = 0;
        PizzaHut.isRunning = false;
        PizzaHut.selectTab("choosenJobs");
        alert("Finished");
    };
    PizzaHut.updateStatistics = function (oldXp) {
        var xpDifference = Character.experience - oldXp;
        PizzaHut.statistics.xpInSession += xpDifference;
        PizzaHut.statistics.totalXp += xpDifference;
    }
    PizzaHut.run = function () {
        PizzaHut.checkMotivation(0, [], function (result) {

            if(PizzaHut.autoRefresh){
            function delayedFunction() {
                location.reload();
  
            }
            setTimeout(delayedFunction, 2400000);}

            PizzaHut.standsJob = PizzaHut.addedJobs.length - PizzaHut.jobsBelowMotivation(result);

            if (PizzaHut.settings.betterWork) {
                if (!(BuffList.cooldowns[1890000] != undefined && BuffList.cooldowns[1890000].time > new ServerDate().getTime())) {
                    if (50 >= ((Character.health / Character.maxHealth) * 100)) {
                        PizzaHut.tryUseHp();

                    }
                    /*else if(Character.energy<120 && !PizzaHut.isHealthBelowLimit()){
    
    
                        if(PizzaHut.standsJob>2)
                        {
                            PizzaHut.tryUseEnergy1();
                        }
    
                    }*/
                }
                //console.log(PizzaHut.standsJob)


                if ((PizzaHut.isMotivationAbove(result) || PizzaHut.isStopMotivationZero()) && Character.energy > 0 && !PizzaHut.isHealthBelowLimit()) {
                    PizzaHut.currentState = 1;
                    PizzaHut.selectTab("choosenJobs");
                    PizzaHut.prepareJobRun(PizzaHut.currentJob.job);
                } else {
                    if (!PizzaHut.canAddMissing(result)) {
                        PizzaHut.finishRun();
                    } else {
                        var answer = PizzaHut.tryUseConsumable(result);
                        if (!answer) {
                            PizzaHut.finishRun();
                        }
                    }
                }
            }
            else {
                if ((PizzaHut.isMotivationAbove(result) || PizzaHut.isStopMotivationZero()) && Character.energy > 0 && !PizzaHut.isHealthBelowLimit()) {
                    PizzaHut.currentState = 1;
                    PizzaHut.selectTab("choosenJobs");
                    PizzaHut.prepareJobRun(PizzaHut.currentJob.job);
                } else {
                    if (!PizzaHut.canAddMissing(result)) {
                        PizzaHut.finishRun();
                    } else {
                        var answer = PizzaHut.tryUseConsumable(result);
                        if (!answer) {
                            PizzaHut.finishRun();
                        }
                    }


                }
            }

        }
        );

    };
    PizzaHut.prepareJobRun = function (index) {
        setTimeout(function () {
            PizzaHut.loadJobMotivation(index, async function (motivation) {

                //console.log("Pozostalo prac: " + PizzaHut.standsJob);


                if (Character.energy == 0 || PizzaHut.isHealthBelowLimit()) {
                    PizzaHut.run();
                }
                else if (motivation <= PizzaHut.addedJobs[index].stopMotivation && PizzaHut.addedJobs[index].stopMotivation > 0) {
                    PizzaHut.changeJob();
                } else
                    if (Map.calcWayTime(Character.position, { x: PizzaHut.addedJobs[index].x, y: PizzaHut.addedJobs[index].y }) == 0) {

                        if (PizzaHut.settings.betterWork) {

                            if (!(BuffList.cooldowns[1890000] != undefined && BuffList.cooldowns[1890000].time > new ServerDate().getTime())) {
                                if (50 >= ((Character.health / Character.maxHealth) * 100)) {
                                    PizzaHut.tryUseHp();
                                }
                                else if (Character.energy < 120 && !PizzaHut.isHealthBelowLimit()) {
                                    if (PizzaHut.standsJob > 1) {
                                        PizzaHut.tryUseEnergy1();
                                    }
                                }
                            }
                        }


                        var maxJobs;
                        (Premium.hasBonus('automation')) ? maxJobs = 9 : maxJobs = 4;
                        if (PizzaHut.addedJobs[index].stopMotivation != 0) {
                            var numberOfJobs = Math.min(Math.min(motivation - PizzaHut.addedJobs[index].stopMotivation, Character.energy), maxJobs);
                        } else {
                            var numberOfJobs = Math.min(Character.energy, maxJobs);


                        }

                        PizzaHut.runJob(index, numberOfJobs);
                    } else {
                        var equiped = await PizzaHut.equipSet(PizzaHut.travelSet);
                        PizzaHut.walkToJob(index);
                    }
            });
        }, PizzaHut.generateRandomNumber(PizzaHut.settings.jobDelayMin, PizzaHut.settings.jobDelayMax) * 100);
    };





    PizzaHut.walkToJob = async function (index) {
        JobWindow.startJob(PizzaHut.addedJobs[index].id, PizzaHut.addedJobs[index].x, PizzaHut.addedJobs[index].y, 15);
        if (PizzaHut.jobSet != -1) {
            await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1000));
        }
        if (PizzaHut.jobSet != -1) {
            PizzaHut.equipSet(PizzaHut.jobSet);
            await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 100));
        }
        while (true) {
            if (PizzaHut.settings.betterWork) {
                if (!(BuffList.cooldowns[1890000] != undefined && BuffList.cooldowns[1890000].time > new ServerDate().getTime())) {
                    await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 100));
                    if (45 >= ((Character.health / Character.maxHealth) * 100)) {
                        PizzaHut.tryUseHp();
                        await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1100));
                    }
                    else if (Character.energy < 120 && !PizzaHut.isHealthBelowLimit()) {
                        PizzaHut.tryUseEnergy1();

                    }
                    await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 100));
                }
            }


            if (Map.calcWayTime(Character.position, { x: PizzaHut.addedJobs[index].x, y: PizzaHut.addedJobs[index].y }) == 0) {
                break;
            }
            if (!PizzaHut.isRunning) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
        }
        PizzaHut.cancelJobs();
        if (PizzaHut.isRunning)
            PizzaHut.prepareJobRun(index);
    };
    PizzaHut.changeJob = function () {
        (PizzaHut.currentJob.direction) ? PizzaHut.currentJob.job++ : PizzaHut.currentJob.job--;
        if (PizzaHut.currentJob.job == PizzaHut.addedJobs.length) {
            PizzaHut.currentJob.job = 0;
            PizzaHut.currentJob.direction = true;
        } else if (PizzaHut.currentJob.job < 0) {
            PizzaHut.currentJob.job++;
            PizzaHut.currentJob.direction = true;
        }

        PizzaHut.run();
    };
    PizzaHut.runJob = async function (jobIndex, jobCount) {
        PizzaHut.statistics.jobsInSession += jobCount;
        PizzaHut.statistics.totalJobs += jobCount;
        var oldXp = Character.experience;

        await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1000));

        if (PizzaHut.pointsSet != -1) {
            //console.log("Stage 0 pointsset");
            PizzaHut.equipSet(PizzaHut.pointsSet);
            await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1000));
        }

        for (var i = 0; i < jobCount; i++) {
            JobWindow.startJob(PizzaHut.addedJobs[jobIndex].id, PizzaHut.addedJobs[jobIndex].x, PizzaHut.addedJobs[jobIndex].y, 15);
        }
        await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1000));

        if (PizzaHut.jobSet != -1) {
            PizzaHut.equipSet(PizzaHut.jobSet);
            await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 100));
        }


        while (true) {
            if (TaskQueue.queue.length == 0) {

                //var randomValue = Math.random();

                //if(randomValue < 0.5){
                //     PizzaHut.run();
                // }else{
                PizzaHut.prepareJobRun(jobIndex)
                // }

                // PizzaHut.prepareJobRun(jobIndex);
                //PizzaHut.run();
                return;
            }
            else if (TaskQueue.queue.length > 0) {
                await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 100));
                if (PizzaHut.settings.betterWork) {
                    if (!(BuffList.cooldowns[1890000] != undefined && BuffList.cooldowns[1890000].time > new ServerDate().getTime())) {
                        if (50 >= ((Character.health / Character.maxHealth) * 100)) {
                            PizzaHut.cancelJobs();
                            await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 300));
                            PizzaHut.tryUseHp();
                            await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 2000));
                        }
                        else if (Character.energy < 120 && !PizzaHut.isHealthBelowLimit()) {
                            if (PizzaHut.standsJob > 1) {
                                PizzaHut.tryUseEnergy1();
                            }

                        }
                    }
                    await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 100));
                }
            }

            //if(!PizzaHut.isRunning || PizzaHut.isHealthBelowLimit()) {
            if (!PizzaHut.isRunning) {
                break;
            }
            await new Promise(r => setTimeout(r, 1));
            if (PizzaHut.isHealthBelowLimit()) {
                while (true) {
                    await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 100));
                    if (!(BuffList.cooldowns[1890000] != undefined && BuffList.cooldowns[1890000].time > new ServerDate().getTime())) {
                        PizzaHut.tryUseHp();
                        await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 1100));
                        break;
                    }
                    await new Promise(r => setTimeout(r, PizzaHut.settings.setWearDelay * 100));
                }

            }
            await new Promise(r => setTimeout(r, 1));
        }
        PizzaHut.statistics.jobsInSession -= TaskQueue.queue.length;
        PizzaHut.statistics.totalJobs -= TaskQueue.queue.length;
        PizzaHut.updateStatistics(oldXp);

        PizzaHut.cancelJobs();

    };
    PizzaHut.cancelJobs = function () {
        if (TaskQueue.queue.length > 0)
            TaskQueue.cancelAll();
    };



    PizzaHut.saveSetttings = function () {
        var temporaryObject = {
            addedJobs: PizzaHut.addedJobs,
            travelSet: PizzaHut.travelSet,
            pointsSet: PizzaHut.pointsSet,
            jobSet: PizzaHut.jobSet,
            healthSet: PizzaHut.healthSet,
            allConsumables: PizzaHut.allConsumables,
            settings: PizzaHut.settings
            //currentJob:PizzaHut.currentJob
        };
        localStorage.setItem('aR', PizzaHut.autoRefresh);

        var jsonTemporary = JSON.stringify(temporaryObject);
        const encrypted = CryptoJS.AES.encrypt(jsonTemporary, 'kubas').toString()
        //console.log(encrypted)
        //const decrypted = CryptoJS.AES.decrypt(encrypted, 'kubas').toString(CryptoJS.enc.Utf8);
        //console.log(decrypted)
        localStorage.setItem('xyz', encrypted);
        console.log(jsonTemporary);
    };

    PizzaHut.reloadSetttings = function (settings_Pool) {
        var settingsG = 0;
        if (settings_Pool != null) {
            settingsG = settings_Pool.getValue();
            settingsG = settingsG.toString();
        } else if (localStorage.getItem('xyz')) {
            var storageLog = localStorage.getItem('xyz')
            console.log(storageLog);
            var decrypted = CryptoJS.AES.decrypt(storageLog, 'kubas').toString(CryptoJS.enc.Utf8);
            settingsG = decrypted;
            console.log(
                "Reading a config"
            )
            console.log(settingsG)
        }
        //console.log(settingsG);
        //settingsG = settingsG.toString();
        //for(var i = 0; i < settingsG.length;i++) {
        //var obj = cookie[i+1].split(";");
        //var tempObject = JSON.parse(obj[0]);
        if (localStorage.getItem('aR') === null) {
            PizzaHut.autoRefresh = false;
            localStorage.setItem('aR', JSON.stringify(PizzaHut.autoRefresh));
        } else {
            PizzaHut.autoRefresh = JSON.parse(localStorage.getItem('aR'));
        }


        if (settingsG != 0) {
            var tempObject = JSON.parse(settingsG);
            console.log(tempObject);
            var tmpAddedJobs = tempObject.addedJobs;
            for (var j = 0; j < tmpAddedJobs.length; j++) {
                var jobP = new JobPrototype(tmpAddedJobs[j].x, tmpAddedJobs[j].y, tmpAddedJobs[j].id);
                jobP.setSilver(tmpAddedJobs[j].silver);
                jobP.distance = tmpAddedJobs[j].distance;
                jobP.setExperience(tmpAddedJobs[j].experience);
                jobP.setMoney(tmpAddedJobs[j].money);
                jobP.setMotivation(tmpAddedJobs[j].motivation);
                jobP.setStopMotivation(tmpAddedJobs[j].stopMotivation);
                jobP.setSet(tmpAddedJobs[j].set);
                PizzaHut.addedJobs.push(jobP);
            }
            var tmpAllConsumables = tempObject.allConsumables;
            for (var j = 0; j < tmpAllConsumables.length; j++) {
                var consumableP = new ConsumablePrototype(tmpAllConsumables[j].id, tmpAllConsumables[j].image, tmpAllConsumables[j].name);
                consumableP.setEnergy(tmpAllConsumables[j].energy);
                consumableP.setMotivation(tmpAllConsumables[j].motivation);
                consumableP.setHealth(tmpAllConsumables[j].health);
                consumableP.setSelected(tmpAllConsumables[j].selected);
                consumableP.setCount(tmpAllConsumables[j].count);
                PizzaHut.allConsumables.push(consumableP);
            }

            var tmpSettings = tempObject.settings;

            PizzaHut.settings.addEnergy = tmpSettings.addEnergy;
            PizzaHut.settings.addMotivation = tmpSettings.addMotivation;
            PizzaHut.settings.addHealth = tmpSettings.addHealth;
            PizzaHut.settings.betterWork = tmpSettings.betterWork;


            PizzaHut.settings.healthStop = tmpSettings.healthStop;
            PizzaHut.settings.setWearDelay = tmpSettings.setWearDelay;
            PizzaHut.settings.jobDelayMin = tmpSettings.jobDelayMin;
            PizzaHut.settings.jobDelayMax = tmpSettings.jobDelayMax;

            PizzaHut.travelSet = tempObject.travelSet;
            PizzaHut.jobSet = tempObject.jobSet;
            PizzaHut.healthSet = tempObject.healthSet;
            PizzaHut.pointsSet = tempObject.pointsSet;
            //PizzaHut.currentJob = tempObject.currentJob;
            // }
        }

    };

    PizzaHut.automation = function () {
        if (PizzaHut.autoRefresh) {

            function cJ()  {
            PizzaHut.cancelJobs();
            }
            setTimeout(cJ, 10000);


            function initialize() {
                PizzaHut.loadJobs();
            } setTimeout(initialize, 15000);

            function autoStart() {
                PizzaHut.selectTab("choosenJobs");
                var parseSuccessful = PizzaHut.parseStopMotivation();
                if (parseSuccessful) {
                    PizzaHut.createRoute();
                    PizzaHut.sortJobLvl();
                    PizzaHut.isRunning = true;
                    PizzaHut.run();
                } else {
                    new UserMessage("Wrong format of set stop motivation", UserMessage.TYPE_ERROR).show();
                }
            }
            setTimeout(autoStart, 25000);
        }
    };

    PizzaHut.clearSetttings = function () {
            localStorage.removeItem("aR");
            localStorage.removeItem("xyz")
            function cS()  {
                location.reload();
            }
            setTimeout(cS, 3000);
    };



    PizzaHut.createWindow = function () {
        var window = wman.open("PizzaHut").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("PizzaHut2");
        var content = $('<div class=\'PizzaHut2window\'/>');
        var tabs = {
            "jobs": "Jobs",
            "choosenJobs": "Choosen jobs",
            "sets": "Sets",
            "consumables": "Consumables",
            "stats": "Statistics",
            "settings": "Settings"
        };
        var tabLogic = function (win, id) {
            var content = $('<div class=\'PizzaHut2window\'/>');
            switch (id) {
                case "jobs":
                    PizzaHut.loadJobData(function () {
                        PizzaHut.removeActiveTab(this);
                        PizzaHut.removeWindowContent();
                        PizzaHut.addActiveTab("jobs", this);
                        content.append(PizzaHut.createJobsTab());
                        PizzaHut.window.appendToContentPane(content);
                        PizzaHut.addJobTableCss();
                        $(".PizzaHut2window .tw2gui_scrollpane_clipper_contentpane").css({ "top": PizzaHut.jobTablePosition.content });
                        $(".PizzaHut2window .tw2gui_scrollbar_pulley").css({ "top": PizzaHut.jobTablePosition.scrollbar });
                        PizzaHut.addEventsHeader();
                    });
                    break;
                case "choosenJobs":
                    PizzaHut.removeActiveTab(this);
                    PizzaHut.removeWindowContent();
                    PizzaHut.addActiveTab("choosenJobs", this);
                    content.append(PizzaHut.createAddedJobsTab());
                    PizzaHut.window.appendToContentPane(content);
                    $(".PizzaHut2window .tw2gui_scrollpane_clipper_contentpane").css({ "top": PizzaHut.addedJobTablePosition.content });
                    $(".PizzaHut2window .tw2gui_scrollbar_pulley").css({ "top": PizzaHut.addedJobTablePosition.scrollbar });
                    PizzaHut.addAddedJobsTableCss();
                    break;
                case "consumables":
                    PizzaHut.removeActiveTab(this);
                    PizzaHut.removeWindowContent();
                    PizzaHut.addActiveTab("consumables", this);
                    PizzaHut.findAllConsumables();
                    content.append(PizzaHut.createConsumablesTable());
                    PizzaHut.window.appendToContentPane(content);
                    $(".PizzaHut2window .tw2gui_scrollpane_clipper_contentpane").css({ "top": PizzaHut.consumableTablePosition.content });
                    $(".PizzaHut2window .tw2gui_scrollbar_pulley").css({ "top": PizzaHut.consumableTablePosition.scrollbar });
                    PizzaHut.addConsumableTableCss();
                    break;
                case "sets":
                    PizzaHut.loadSets(function () {
                        PizzaHut.removeActiveTab(this);
                        PizzaHut.removeWindowContent();
                        PizzaHut.addActiveTab("sets", this);
                        content.append(PizzaHut.createSetGui())
                        PizzaHut.window.appendToContentPane(content);
                    });
                    break;
                case "stats":
                    PizzaHut.removeActiveTab(this);
                    PizzaHut.removeWindowContent();
                    PizzaHut.addActiveTab("stats", this);
                    content.append(PizzaHut.createStatisticsGui());
                    PizzaHut.window.appendToContentPane(content);
                    break;
                case "settings":
                    PizzaHut.removeActiveTab(this);
                    PizzaHut.removeWindowContent();
                    PizzaHut.addActiveTab("settings", this);
                    content.append(PizzaHut.createSettingsGui());
                    PizzaHut.window.appendToContentPane(content);
                    break;
            }
        }
        for (var tab in tabs) {
            window.addTab(tabs[tab], tab, tabLogic);
        }
        PizzaHut.window = window;
        PizzaHut.selectTab("jobs");
    };
    PizzaHut.selectTab = function (key) {
        PizzaHut.window.tabIds[key].f(PizzaHut.window, key);
    };
    PizzaHut.removeActiveTab = function (window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };
    PizzaHut.addActiveTab = function (key, window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };
    PizzaHut.removeWindowContent = function () {
        $(".PizzaHut2window").remove();
    };
    PizzaHut.addJobTableCss = function () {
        $(".PizzaHut2window .jobIcon").css({ "width": "80px" });
        $(".PizzaHut2window .jobName").css({ "width": "150px" });
        $(".PizzaHut2window .jobXp").css({ "width": "40px" });
        $(".PizzaHut2window .jobMoney").css({ "width": "40px" });
        $(".PizzaHut2window .jobMotivation").css({ "width": "40px" });
        $(".PizzaHut2window .jobDistance").css({ "width": "100px" });
        $(".PizzaHut2window .row").css({ "height": "60px" });
        $('.PizzaHut2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    PizzaHut.addAddedJobsTableCss = function () {
        $(".PizzaHut2window .jobIcon").css({ "width": "80px" });
        $(".PizzaHut2window .jobName").css({ "width": "130px" });
        $(".PizzaHut2window .jobStopMotivation").css({ "width": "110px" });
        $(".PizzaHut2window .jobRemove").css({ "width": "105px" });
        $(".PizzaHut2window .jobSet").css({ "width": "100px" });
        $(".PizzaHut2window .row").css({ "height": "60px" });
        $('.PizzaHut2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    PizzaHut.addConsumableTableCss = function () {
        $(".PizzaHut2window .consumIcon").css({ "width": "80px" });
        $(".PizzaHut2window .consumName").css({ "width": "120px" });
        $(".PizzaHut2window .consumCount").css({ "width": "70px" });
        $(".PizzaHut2window .consumEnergy").css({ "width": "70px" });
        $(".PizzaHut2window .consumMotivation").css({ "width": "70px" });
        $(".PizzaHut2window .consumHealth").css({ "width": "70px" });
        $(".PizzaHut2window .row").css({ "height": "80px" });
        $('.PizzaHut2window').find('.tw2gui_scrollpane').css('height', '250px');
    };
    PizzaHut.addEventsHeader = function () {
        $(".PizzaHut2window .jobXp").click(function () {
            if (PizzaHut.sortJobTableXp == 0) {
                PizzaHut.sortJobTableXp = 1;
            } else {
                (PizzaHut.sortJobTableXp == 1) ? PizzaHut.sortJobTableXp = -1 : PizzaHut.sortJobTableXp = 1;
            }
            PizzaHut.sortJobTableDistance = 0;
            PizzaHut.selectTab("jobs");
        });
        $(".PizzaHut2window .jobDistance").click(function () {
            if (PizzaHut.sortJobTableDistance == 0) {
                PizzaHut.sortJobTableDistance = 1;
            } else {
                (PizzaHut.sortJobTableDistance == 1) ? PizzaHut.sortJobTableDistance = -1 : PizzaHut.sortJobTableDistance = 1;
            }
            PizzaHut.sortJobTableXp = 0;
            PizzaHut.selectTab("jobs");
        });
    };
    PizzaHut.createJobsTab = function () {
        var htmlSkel = $("<div id = \'jobs_overview'\></div>");
        var html = $("<div class = \'jobs_search'\ style=\'position:relative;'\><div id=\'jobFilter'\style=\'position:absolute;top:10px;left:15px'\></div><div id=\'job_only_silver'\style=\'position:absolute;top:10px;left:200px;'\></div><div id=\'job_no_silver'\style=\'position:absolute;top:10px;left:270px;'\></div><div id=\'job_center'\style=\'position:absolute;top:10px;left:350px;'\></div><div id=\'button_filter_jobs'\style=\'position:absolute;top:5px;left:450px;'\></div><div id=\'jobX'\style=\'position:absolute;top:50px;left:15px'\></div><div id=\'jobY'\style=\'position:absolute;top:50px;left:100px'\></div><div id=\'jobID'\style=\'position:absolute;top:50px;left:200px'\></div></div>");
        var table = new west.gui.Table();
        var xpIcon = '<img src="/images/icons/star.png">';
        var dollarIcon = '<img src="/images/icons/dollar.png">';
        var motivationIcon = '<img src="/images/icons/motivation.png">';
        var arrow_desc = '&nbsp;<img src="../images/window/jobs/sortarrow_desc.png"/>';
        var arrow_asc = '&nbsp;<img src="../images/window/jobs/sortarrow_asc.png"/>';
        var uniqueJobs = PizzaHut.getAllUniqueJobs();
        table.addColumn("jobIcon", "jobIcon").addColumn("jobName", "jobName").addColumn("jobXp", "jobXp").addColumn("jobMoney", "jobMoney").addColumn("jobMotivation", "jobMotivation").addColumn("jobDistance", "jobDistance").addColumn("jobAdd", "jobAdd");
        table.appendToCell("head", "jobIcon", "Job icon").appendToCell("head", "jobName", "Job name").appendToCell("head", "jobXp", xpIcon + (PizzaHut.sortJobTableXp == 1 ? arrow_asc : PizzaHut.sortJobTableXp == -1 ? arrow_desc : "")).appendToCell("head", "jobMoney", dollarIcon).appendToCell("head", "jobMotivation", motivationIcon).appendToCell("head", "jobDistance", "Distance " + (PizzaHut.sortJobTableDistance == 1 ? arrow_asc : PizzaHut.sortJobTableDistance == -1 ? arrow_desc : "")).appendToCell("head", "jobAdd", "");
        for (var job = 0; job < uniqueJobs.length; job++) {
            table.appendRow().appendToCell(-1, "jobIcon", PizzaHut.getJobIcon(uniqueJobs[job].silver, uniqueJobs[job].id, uniqueJobs[job].x, uniqueJobs[job].y)).appendToCell(-1, "jobName", PizzaHut.getJobName(uniqueJobs[job].id)).appendToCell(-1, "jobXp", uniqueJobs[job].experience).appendToCell(-1, "jobMoney", uniqueJobs[job].money).appendToCell(-1, "jobMotivation", uniqueJobs[job].motivation).appendToCell(-1, "jobDistance", uniqueJobs[job].distance.formatDuration()).appendToCell(-1, "jobAdd", PizzaHut.createAddJobButton(uniqueJobs[job].x, uniqueJobs[job].y, uniqueJobs[job].id));
        }
        var textfield = new west.gui.Textfield("jobsearch").setPlaceholder("Select job name");

        var job_X = new west.gui.Textfield("job_cor_x").setPlaceholder("job_x");
        var job_Y = new west.gui.Textfield("job_cor_y").setPlaceholder("job_y");
        var job_ID = new west.gui.Textfield("job_id_id").setPlaceholder("job_id");

        if (PizzaHut.jobFilter.filterJob != "") {
            textfield.setValue(PizzaHut.jobFilter.filterJob);
        }
        var checkboxOnlySilver = new west.gui.Checkbox();
        checkboxOnlySilver.setLabel("Silvers");
        checkboxOnlySilver.setSelected(PizzaHut.jobFilter.filterOnlySilver);
        checkboxOnlySilver.setCallback(function () {
            if (this.isSelected()) {
                PizzaHut.jobFilter.filterOnlySilver = true;
            } else {
                PizzaHut.jobFilter.filterOnlySilver = false;
            }
        });
        var checkboxNoSilver = new west.gui.Checkbox();
        checkboxNoSilver.setLabel("No silvers");
        checkboxNoSilver.setSelected(PizzaHut.jobFilter.filterNoSilver);
        checkboxNoSilver.setCallback(function () {
            if (this.isSelected()) {
                PizzaHut.jobFilter.filterNoSilver = true;
            } else {
                PizzaHut.jobFilter.filterNoSilver = false;
            }
        });
        var checkboxCenterJobs = new west.gui.Checkbox();
        checkboxCenterJobs.setLabel("Center jobs");
        // checkboxCenterJobs.setSelected(PizzaHut.jobFilter.filterCenterJobs);
        checkboxCenterJobs.setCallback(function () {
            if (this.isSelected()) {
                //PizzaHut.jobFilter.filterCenterJobs = true;
                var inputX = document.getElementById('job_cor_x');
                if (inputX) {
                    inputX.value = PizzaHut.AktualnyX;
                }
                var inputY = document.getElementById('job_cor_y');
                if (inputY) {
                    inputY.value = PizzaHut.AktualnyY;
                }
            } else {
                //PizzaHut.jobFilter.filterCenterJobs = false;
                var inputX = document.getElementById('job_cor_x');
                if (inputX) {
                    inputX.value = '';
                }
                var inputY = document.getElementById('job_cor_y');
                if (inputY) {
                    inputY.value = '';
                }
            }
        });



        var buttonFilter = new west.gui.Button("Filter", function () {
            PizzaHut.jobFilter.filterJob = textfield.getValue();
            //console.log(job_X.getValue() + " " + job_Y.getValue() + " " + job_ID.getValue());
            PizzaHut.jobTablePosition.content = "0px";
            PizzaHut.jobTablePosition.scrollbar = "0px";

            if (Number(job_X.getValue()) > 1 && Number(job_Y.getValue()) > 1 && Number(job_ID.getValue()) > 1) {
                PizzaHut.addJob(job_X.getValue(), job_Y.getValue(), job_ID.getValue());
            }
            PizzaHut.selectTab("jobs");
        });

        /*var buttonAdd = new west.gui.Button("Add my job",function() {
            console.log(job_X.getValue()+" "+job_Y.getValue()+" "+job_ID.getValue());
            PizzaHut.addJob(job_X.getValue(),job_Y.getValue(),job_ID.getValue());
            PizzaHut.jobTablePosition.content = "0px";
            PizzaHut.jobTablePosition.scrollbar = "0px";
            PizzaHut.selectTab("jobs");
        });*/



        htmlSkel.append(table.getMainDiv());
        $('#jobFilter', html).append(textfield.getMainDiv());
        $("#job_only_silver", html).append(checkboxOnlySilver.getMainDiv());
        $("#job_no_silver", html).append(checkboxNoSilver.getMainDiv());
        $("#job_center", html).append(checkboxCenterJobs.getMainDiv());
        $("#button_filter_jobs", html).append(buttonFilter.getMainDiv());
        $('#jobX', html).append(job_X.getMainDiv());
        $('#jobY', html).append(job_Y.getMainDiv());
        $('#jobID', html).append(job_ID.getMainDiv());
        //$('#buttonMyJob', html).append(buttonAdd.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };
    PizzaHut.createAddJobButton = function (x, y, id) {
        var buttonAdd = new west.gui.Button("Add new job", function () {
            PizzaHut.addJob(x, y, id);
            PizzaHut.AktualnyX = x
            PizzaHut.AktualnyY = y
            PizzaHut.jobTablePosition.content = $(".PizzaHut2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            PizzaHut.jobTablePosition.scrollbar = $(".PizzaHut2window .tw2gui_scrollbar_pulley").css("top");
            PizzaHut.selectTab("jobs");
        });
        buttonAdd.setWidth(100);
        return buttonAdd.getMainDiv();
    };

    PizzaHut.sortJobLvl = function () {
        var temp;
        for (var i = 0; i < PizzaHut.addedJobs.length; i++) {
            for (var j = 0; j < PizzaHut.addedJobs.length; j++) {
                if (i != j) {
                    if ((PizzaHut.addedJobs[i].x == PizzaHut.addedJobs[j].x) && (PizzaHut.addedJobs[i].y == PizzaHut.addedJobs[j].y)) {
                        if (PizzaHut.addedJobs[i].id < PizzaHut.addedJobs[j].id) {
                            temp = PizzaHut.addedJobs[i];
                            PizzaHut.addedJobs[i] = PizzaHut.addedJobs[j];
                            PizzaHut.addedJobs[j] = temp;
                        }
                    }

                }

            }
        }
    }

    PizzaHut.createAddedJobsTab = function () {
        var htmlSkel = $("<div id=\'added_jobs_overview'\></div>");
        var footerHtml = $("<div id=\'start_PizzaHut2'\ style=\'position:relative;'\><span class =\'PizzaHut_state'\ style=\' position:absolute;left:20px; top:10px; font-family: Arial, Helvetica, sans-serif; font-size: 15px;font-weight: bold;'\> Current state:" + PizzaHut.states[PizzaHut.currentState] + "</span><div class = \'PizzaHut_run'\ style = \'position:absolute; left:350px; top:20px;'\></div></div>");
        var table = new west.gui.Table();
        table.addColumn("jobIcon", "jobIcon").addColumn("jobName", "jobName").addColumn("jobStopMotivation", "jobStopMotivation").addColumn("jobSet", "jobSet").addColumn("jobRemove", "jobRemove");
        table.appendToCell("head", "jobIcon", "Job icon").appendToCell("head", "jobName", "Job name").appendToCell("head", "jobStopMotivation", "Stop motivation").appendToCell("head", "jobSet", "Job set").appendToCell("head", "jobRemove", "");
        for (var job = 0; job < PizzaHut.addedJobs.length; job++) {
            table.appendRow().appendToCell(-1, "jobIcon", PizzaHut.getJobIcon(PizzaHut.addedJobs[job].silver, PizzaHut.addedJobs[job].id, PizzaHut.addedJobs[job].x, PizzaHut.addedJobs[job].y)).appendToCell(-1, "jobName", PizzaHut.getJobName(PizzaHut.addedJobs[job].id)).appendToCell(-1, "jobStopMotivation", PizzaHut.createMinMotivationTextfield(PizzaHut.addedJobs[job].x, PizzaHut.addedJobs[job].y, PizzaHut.addedJobs[job].id, PizzaHut.addedJobs[job].stopMotivation)).appendToCell(-1, "jobSet", PizzaHut.createComboxJobSets(PizzaHut.addedJobs[job].x, PizzaHut.addedJobs[job].y, PizzaHut.addedJobs[job].id)).appendToCell(-1, "jobRemove", PizzaHut.createRemoveJobButton(PizzaHut.addedJobs[job].x, PizzaHut.addedJobs[job].y, PizzaHut.addedJobs[job].id));
        }
        var buttonStart = new west.gui.Button("Start", function () {
            var parseSuccesfull = PizzaHut.parseStopMotivation();
            if (parseSuccesfull) {
                PizzaHut.createRoute();
                PizzaHut.sortJobLvl();
                PizzaHut.isRunning = true;
                PizzaHut.run();
            } else {
                new UserMessage("Wrong format of set stop motivation", UserMessage.TYPE_ERROR).show();
            }
        });
        var buttonStop = new west.gui.Button("Stop", function () {
            PizzaHut.isRunning = false;
            PizzaHut.currentState = 0;
            PizzaHut.selectTab("choosenJobs");
        });
        htmlSkel.append(table.getMainDiv());
        $(".PizzaHut_run", footerHtml).append(buttonStart.getMainDiv());
        $(".PizzaHut_run", footerHtml).append(buttonStop.getMainDiv());
        htmlSkel.append(footerHtml);
        return htmlSkel;
    };
    PizzaHut.createMinMotivationTextfield = function (x, y, id, placeholder) {
        var componentId = "x-" + x + "y-" + y + "id-" + id;
        var textfield = new west.gui.Textfield();
        textfield.setId(componentId);
        textfield.setWidth(40);
        textfield.setValue(placeholder);
        return textfield.getMainDiv();
    };
    PizzaHut.createRemoveJobButton = function (x, y, id) {
        var buttonRemove = new west.gui.Button("Remove job", function () {
            PizzaHut.removeJob(x, y, id);
            PizzaHut.addedJobTablePosition.content = $(".PizzaHut2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            PizzaHut.addedJobTablePosition.scrollbar = $(".PizzaHut2window .tw2gui_scrollbar_pulley").css("top");
            PizzaHut.selectTab("choosenJobs");
        });
        buttonRemove.setWidth(100);
        return buttonRemove.getMainDiv();
    };
    PizzaHut.createComboxJobSets = function (x, y, id) {
        var combobox = new west.gui.Combobox();
        PizzaHut.addComboboxItems(combobox);
        combobox.setWidth(60);
        combobox.addListener(function (value) {
            PizzaHut.selectTab("choosenJobs");
        });
        return combobox.getMainDiv();
    };
    PizzaHut.addComboboxItems = function (combobox) {
        combobox.addItem(-1, "None");
        for (var i = 0; i < PizzaHut.sets.length; i++) {
            combobox.addItem(i.toString(), PizzaHut.sets[i].name);
        }
    };
    PizzaHut.createSetGui = function () {
        if (PizzaHut.sets.length == 0) {
            return $("<span style=\'font-size:20px'\>No sets available</span>");
        }
        var htmlSkel = $("<div id =\'PizzaHut2_sets_window'\ style=\'display:block;position:relative;width:650px;height:430px;'\><div id=\'PizzaHut2_sets_left' style=\'display:block;position:absolute;width:250px;height:430px;top:0px;left:0px'\></div><div id=\'PizzaHut2_sets_right' style=\'display:block;position:absolute;width:300px;height:410px;top:0px;left:325px'\></div></div>");
        var combobox = new west.gui.Combobox("combobox_sets");
        PizzaHut.addComboboxItems(combobox);
        combobox = combobox.select(PizzaHut.selectedSet);
        combobox.addListener(function (value) {
            PizzaHut.selectedSet = value;
            PizzaHut.selectTab("sets");
        });
        var buttonSelectTravelSet = new west.gui.Button("Select travel set", function () {
            PizzaHut.travelSet = PizzaHut.selectedSet;
            PizzaHut.selectTab("sets");
        });
        var buttonSelectPointsSet = new west.gui.Button("Select points set", function () {
            PizzaHut.pointsSet = PizzaHut.selectedSet;
            PizzaHut.selectTab("sets");
        });
        var buttonSelectJobSet = new west.gui.Button("Select job set", function () {
            PizzaHut.jobSet = PizzaHut.selectedSet;
            PizzaHut.selectTab("sets");
        });
        var buttonSelectHealthSet = new west.gui.Button("Select health set", function () {
            PizzaHut.healthSet = PizzaHut.selectedSet;
            PizzaHut.selectTab("sets");
        });
        var travelSetText = "None";
        if (PizzaHut.travelSet != -1) {
            travelSetText = PizzaHut.sets[PizzaHut.travelSet].name;
        }
        var pointsSetText = "None";
        if (PizzaHut.pointsSet != -1) {
            pointsSetText = PizzaHut.sets[PizzaHut.pointsSet].name;
        }
        var jobSetText = "None";
        if (PizzaHut.jobSet != -1) {
            jobSetText = PizzaHut.sets[PizzaHut.jobSet].name;
        }
        var healthSetText = "None";
        if (PizzaHut.healthSet != -1) {
            healthSetText = PizzaHut.sets[PizzaHut.healthSet].name;
        }
        var left = $("<div></div>").append(new west.gui.Groupframe().appendToContentPane($("<span>Sets</span><br><br>")).appendToContentPane(combobox.getMainDiv()).appendToContentPane($("<br><br><span>Travel set:" + travelSetText + "</span><br><br>")).appendToContentPane(buttonSelectTravelSet.getMainDiv()).appendToContentPane($("<br><br><span>Points set:" + pointsSetText + "</span><br><br>")).appendToContentPane(buttonSelectPointsSet.getMainDiv()).appendToContentPane($("<br><br><span>Job set:" + jobSetText + "</span><br><br>")).appendToContentPane(buttonSelectJobSet.getMainDiv()).appendToContentPane($("<br><br><span>Health set:" + healthSetText + "</span><br><br>")).appendToContentPane(buttonSelectHealthSet.getMainDiv()).getMainDiv());
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
        if (PizzaHut.selectedSet != -1)
            PizzaHut.insertSetImages(right, keys);
        $("#PizzaHut2_sets_left", htmlSkel).append(left);
        $("#PizzaHut2_sets_right", htmlSkel).append(right);
        return htmlSkel;
    };
    PizzaHut.getImageSkel = function () {
        return $("<img src=\''\>");
    };
    PizzaHut.insertSetImages = function (html, keys) {
        for (var i = 0; i < keys.length; i++) {
            if (PizzaHut.sets[PizzaHut.selectedSet][keys[i]] != null) {
                $(".wear_" + keys[i], html).append(PizzaHut.getImageSkel().attr("src", PizzaHut.getItemImage(PizzaHut.sets[PizzaHut.selectedSet][keys[i]])));
            }
        }
        return html;
    };
    PizzaHut.createConsumablesTable = function () {
        var htmlSkel = $("<div id=\'consumables_overview'\></div>");
        var html = $("<div class = \'consumables_filter'\ style=\'position:relative;'\><div id=\'energy_consumables'\style=\'position:absolute;top:10px;left:15px;'\></div><div id=\'motivation_consumables'\style=\'position:absolute;top:10px;left:160px;'\></div><div id=\'health_consumables'\style=\'position:absolute;top:10px;left:320px;'\></div><div id=\'button_filter_consumables'\style=\'position:absolute;top:5px;left:460px;'\></div></div>");
        var table = new west.gui.Table();
        var consumableList = PizzaHut.filterConsumables(PizzaHut.consumableSelection.energy, PizzaHut.consumableSelection.motivation, PizzaHut.consumableSelection.health);
        table.addColumn("consumIcon", "consumIcon").addColumn("consumName", "consumName").addColumn("consumCount", "consumCount").addColumn("consumEnergy", "consumEnergy").addColumn("consumMotivation", "consumMotivation").addColumn("consumHealth", "consumHealth").addColumn("consumSelected", "consumSelected");
        table.appendToCell("head", "consumIcon", "Image").appendToCell("head", "consumName", "Name").appendToCell("head", "consumCount", "Count").appendToCell("head", "consumEnergy", "Energy").appendToCell("head", "consumMotivation", "Motivation").appendToCell("head", "consumHealth", "Health").appendToCell("head", "consumSelected", "Use");
        for (var i = 0; i < consumableList.length; i++) {
            var checkbox = new west.gui.Checkbox();
            checkbox.setSelected(consumableList[i].selected);
            checkbox.setId(consumableList[i].id);
            checkbox.setCallback(function () {
                PizzaHut.changeConsumableSelection(parseInt(this.divMain.attr("id")), this.isSelected());
                PizzaHut.consumableTablePosition.content = $(".PizzaHut2window .tw2gui_scrollpane_clipper_contentpane").css("top");;
                PizzaHut.consumableTablePosition.scrollbar = $(".PizzaHut2window .tw2gui_scrollbar_pulley").css("top");
                PizzaHut.selectTab("consumables");

            });
            table.appendRow().appendToCell(-1, "consumIcon", PizzaHut.getConsumableIcon(consumableList[i].image)).appendToCell(-1, "consumName", consumableList[i].name).appendToCell(-1, "consumCount", consumableList[i].count).appendToCell(-1, "consumEnergy", consumableList[i].energy).appendToCell(-1, "consumMotivation", consumableList[i].motivation).appendToCell(-1, "consumHealth", consumableList[i].health).appendToCell(-1, "consumSelected", checkbox.getMainDiv());
        }
        var buttonSelect = new west.gui.Button("Select all", function () {
            PizzaHut.changeSelectionAllConsumables(true);
            PizzaHut.selectTab("consumables");

        });
        var buttonDeselect = new west.gui.Button("Deselect all", function () {
            PizzaHut.changeSelectionAllConsumables(false);
            PizzaHut.selectTab("consumables");

        });
        table.appendToFooter("consumEnergy", buttonSelect.getMainDiv());
        table.appendToFooter("consumHealth", buttonDeselect.getMainDiv());
        htmlSkel.append(table.getMainDiv());
        var checkboxEnergyConsumes = new west.gui.Checkbox();
        checkboxEnergyConsumes.setLabel("Energy consumables");
        checkboxEnergyConsumes.setSelected(PizzaHut.consumableSelection.energy);
        checkboxEnergyConsumes.setCallback(function () {
            PizzaHut.consumableSelection.energy = this.isSelected();
        });
        var checkboxMotivationConsumes = new west.gui.Checkbox();
        checkboxMotivationConsumes.setLabel("Motivation consumables");
        checkboxMotivationConsumes.setSelected(PizzaHut.consumableSelection.motivation);
        checkboxMotivationConsumes.setCallback(function () {
            PizzaHut.consumableSelection.motivation = this.isSelected();
        });
        var checkboxHealthConsumes = new west.gui.Checkbox();
        checkboxHealthConsumes.setLabel("Health consumables");
        checkboxHealthConsumes.setSelected(PizzaHut.consumableSelection.health);
        checkboxHealthConsumes.setCallback(function () {
            PizzaHut.consumableSelection.health = this.isSelected();
        });
        var buttonFilter = new west.gui.Button("Select", function () {
            PizzaHut.selectTab("consumables");
        });
        $("#energy_consumables", html).append(checkboxEnergyConsumes.getMainDiv());
        $("#motivation_consumables", html).append(checkboxMotivationConsumes.getMainDiv());
        $("#health_consumables", html).append(checkboxHealthConsumes.getMainDiv());
        $("#button_filter_consumables", html).append(buttonFilter.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };



    PizzaHut.createSettingsGui = function () {
        var htmlSkel = $("<div id=\'settings_overview'\ style = \'padding:10px;'\></div>");
        var checkboxAddEnergy = new west.gui.Checkbox();
        checkboxAddEnergy.setLabel("Add energy");
        checkboxAddEnergy.setSelected(PizzaHut.settings.addEnergy);
        checkboxAddEnergy.setCallback(function () {
            PizzaHut.settings.addEnergy = !PizzaHut.settings.addEnergy;
        });
        var checkboxAddMotivation = new west.gui.Checkbox();
        checkboxAddMotivation.setLabel("Add motivation");
        checkboxAddMotivation.setSelected(PizzaHut.settings.addMotivation);
        checkboxAddMotivation.setCallback(function () {
            PizzaHut.settings.addMotivation = !PizzaHut.settings.addMotivation;
        });
        var checkboxAddHealth = new west.gui.Checkbox();
        checkboxAddHealth.setLabel("Add health");
        checkboxAddHealth.setSelected(PizzaHut.settings.addHealth);
        checkboxAddHealth.setCallback(function () {
            PizzaHut.settings.addHealth = !PizzaHut.settings.addHealth;
        });

        var checkboxBetterWork = new west.gui.Checkbox();
        checkboxBetterWork.setLabel("Better work");
        checkboxBetterWork.setSelected(PizzaHut.settings.betterWork);
        checkboxBetterWork.setCallback(function () {
            PizzaHut.settings.betterWork = !PizzaHut.settings.betterWork;
        });

        var checkboxAutoRefresh = new west.gui.Checkbox();
        checkboxAutoRefresh.setLabel("Auto refresh");
        checkboxAutoRefresh.setSelected(PizzaHut.autoRefresh);
        checkboxAutoRefresh.setCallback(function () {
            PizzaHut.autoRefresh = !PizzaHut.autoRefresh;
        });



        var htmlHealthStop = $("<div></div>");
        htmlHealthStop.append("<span> Stoppage health percent value </span>");
        var healthStopTextfiled = new west.gui.Textfield("healthStop");
        healthStopTextfiled.setValue(PizzaHut.settings.healthStop);
        healthStopTextfiled.setWidth(100);
        htmlHealthStop.append(healthStopTextfiled.getMainDiv());
        var htmlSetWearDelay = $("<div></div>");
        htmlSetWearDelay.append("<span> Job set equip delay </span>");
        var setWearDelayTextfiled = new west.gui.Textfield("setWearDelay");
        setWearDelayTextfiled.setValue(PizzaHut.settings.setWearDelay);
        setWearDelayTextfiled.setWidth(100);
        htmlSetWearDelay.append(setWearDelayTextfiled.getMainDiv());

        var htmlJobDelay = $("<div></div>");
        htmlJobDelay.append("<span> Random delay between jobs(10 = 1s 15=1,5s)</span>");
        var jobDelayTextFieldMin = new west.gui.Textfield("jobDelay");
        jobDelayTextFieldMin.setValue(PizzaHut.settings.jobDelayMin);
        jobDelayTextFieldMin.setWidth(50);
        var jobDelayTextFieldMax = new west.gui.Textfield("jobDelay");
        jobDelayTextFieldMax.setValue(PizzaHut.settings.jobDelayMax);
        jobDelayTextFieldMax.setWidth(50);

        htmlJobDelay.append(jobDelayTextFieldMin.getMainDiv());
        htmlJobDelay.append("<span> - </span>");
        htmlJobDelay.append(jobDelayTextFieldMax.getMainDiv());

        var buttonApply = new west.gui.Button("Apply", function () {
            PizzaHut.settings.addEnergy = checkboxAddEnergy.isSelected();
            PizzaHut.settings.addMotivation = checkboxAddMotivation.isSelected();
            PizzaHut.settings.addHealth = checkboxAddHealth.isSelected();
            PizzaHut.settings.betterWork = checkboxBetterWork.isSelected();
            PizzaHut.autoRefresh = checkboxAutoRefresh.isSelected();

            if (PizzaHut.isNumber(healthStopTextfiled.getValue())) {
                var healthStop = parseInt(healthStopTextfiled.getValue());
                healthStop = Math.min(60, healthStop);
                PizzaHut.settings.healthStop = healthStop;
            }
            if (PizzaHut.isNumber(setWearDelayTextfiled.getValue())) {
                var setWearDelay = parseInt(setWearDelayTextfiled.getValue());
                setWearDelay = Math.min(10, setWearDelay);
                PizzaHut.settings.setWearDelay = setWearDelay;
            }
            if (PizzaHut.isNumber(jobDelayTextFieldMin.getValue())) {
                var jobDelayTimeMin = parseInt(jobDelayTextFieldMin.getValue());
                PizzaHut.settings.jobDelayMin = jobDelayTimeMin;
            } else {
                PizzaHut.settings.jobDelayMin = 0;
                PizzaHut.settings.jobDelayMax = 0;
                new UserMessage("Wrong format of delay job min value. Please set a number.", UserMessage.TYPE_ERROR).show();
            }
            if (PizzaHut.isNumber(jobDelayTextFieldMax.getValue())) {
                var jobDelayTimeMax = parseInt(jobDelayTextFieldMax.getValue());
                PizzaHut.settings.jobDelayMax = jobDelayTimeMax;
            } else {
                PizzaHut.settings.jobDelayMin = 0;
                PizzaHut.settings.jobDelayMax = 0;
                new UserMessage("Wrong format of delay job max value. Please set a number.", UserMessage.TYPE_ERROR).show();
            }
            PizzaHut.selectTab("settings");
        })

        htmlSkel.append(checkboxAddEnergy.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxAddMotivation.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxAddHealth.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxBetterWork.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxAutoRefresh.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(htmlHealthStop);
        htmlSkel.append("<br>");
        htmlSkel.append(htmlSetWearDelay);
        htmlSkel.append("<br>");
        htmlSkel.append(htmlJobDelay);
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        return htmlSkel;
    };
    PizzaHut.createStatisticsGui = function () {
        var htmlSkel = $("<div id=\'statistics_overview'\></div>");


        var settings_Pool = new west.gui.Textfield("").setPlaceholder("settings_pool");


        var buttonSave = new west.gui.Button("Save", function () {
            PizzaHut.saveSetttings();
        })
        var buttonReload = new west.gui.Button("Reload", function () {
            PizzaHut.reloadSetttings(settings_Pool);
        })
        var buttonClear = new west.gui.Button("Clear", function () {
            PizzaHut.clearSetttings();
        })


        htmlSkel.append($("<span>Job count in this session: " + PizzaHut.statistics.jobsInSession + "</span><br>"));
        htmlSkel.append($("<span>Xp count in this session: " + PizzaHut.statistics.xpInSession + "</span><br>"));
        htmlSkel.append($("<span>Job count total: " + PizzaHut.statistics.totalJobs + "</span><br>"));


        htmlSkel.append($("<span>Xp count total: " + PizzaHut.statistics.totalXp + "</span><br>"));
        htmlSkel.append(buttonSave.getMainDiv());
        htmlSkel.append(buttonReload.getMainDiv());
        htmlSkel.append(buttonClear.getMainDiv());
        htmlSkel.append($("<span> </span><br>"));
        htmlSkel.append($("<span style=\'padding:50px'\><div id=\'settingsP'\style=\'top:10px;left:15px;padding:50px'\></div></span><br>"));
        $('#settingsP', htmlSkel).append(settings_Pool.getMainDiv());


        return htmlSkel;
    };
    PizzaHut.createMenuIcon = function () {
        var menuimage = 'data:image/png;base64,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dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDozOGI0NTFjNS0xYWU3LTRiMTgtOTc0Zi1mZGM5ODM1MDY0NzkiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDcxYTlkMWMtYmRiMS00OGY1LTgzYTgtN2IyNDE0MTg0MjIwIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YzY1NTNlYjEtYjk0OS00YzhkLWJjYWMtZWI5NDc3MWIxZDJhIgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE2ODg2NzUwNjA3NzI2NjEiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zMiIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjM6MDc6MDZUMjI6MjQ6MTkrMDI6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIzOjA3OjA2VDIyOjI0OjE5KzAyOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MGRlNWIxNTQtMDFhYy00OGZmLTg4NDktMDM4ZGZhYWMzYjFlIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTA3LTA2VDIyOjI0OjIwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PpUJUyMAAAAGYktHRAD6AP8A/2hdKOMAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwYUGBTTMEXeAAAEoklEQVRYw+1Wa2wUVRQ+987szOzu7Ktlt8D2XftaurttqY2RRkuhASIJD6khiMSQiK2PkFhRSYxg+KNJkSDFEEiMTXz+UIloSgyyLW+MUNquUkrb7YOw3W330dLdmd2dmesPaWKwyFoa9Ue/5P645365+XK+c889APOYx38MlCwxVLv6GMTi25MiM8wx06mT9clQcTKkye0vmCCRePYu/8GLkOcmd72pmzMB8vDwFlCIOum8JhIapdu99aEFRA8cRKGVqzaCrOz+p94SSX4rvHrthlnVwOSO+lRlPLCDTEXqQRQzH67KUB9Sqw/jNEuLvuXj0N8KCNdtLiaB4E5QlG2gKOo5LXeaFgCgBdHUAeOPrb1/ETCxddsmZfhW3b/y9FJMnxiPf916XwveaHzd5PV6rZIkQSKRgKzsbGH/gQ/6a6qrK4Wo8D7GuOn8pYs/zEliZgp+f+JEZSwWOwkAwLDsNx1Xr24sczgvKAr5EFPYTtN05pw5M1NQbzCMj/n9AABwvffG0xXl5b+FAsHH9Qb9rdHbXq+tpET/SHZON8uyvaIoFgAAqDWaS4l4PF+SJAIACwxG42WKpsplSZLj8bjFkpb26um2tu9m1QcMBuMEAIBv1BcCgBKOY7MNJqNLbzRc+GPPneM4zu8sLX2FoqhSlmWti62LWxctXHTJmp6xW4gKmbFYfEvSGfgzHquszBv1eh0IIVGn07mCgcCLhBBCZOWgf9TXpWKY22vWrt3dtL8pHIvFjsuybLRmpD8/5h9jwuHwMzRN6xDGoCgymlUnFKLCBlOK6WyRzbZ+zO/vm348lIpuAQDNAvOChqb9TWF7sa0uGomsYxim1dXe3jI+NtYoS1Kqw+l8FwgBQggz0/3UTMF0q3VxNBLZgRCC6703Vg2PjHzae/Nmf0XFo7UAkB+ZmtIm4okUhmW1FEVBUUHhAELoHVlRVDq9HjKsVsLzujMcx9lvjQw/qaJVboSxeXn18i+73e7EAy3g1JwFAIAQArU1K9J7e3rWAEIgCkJ/OBh8SZLlIgCAzKysNoqi9g16PJ1Gk7HTkmbZiDGVPzI01KzRahWMUfOvPT17pu+90tGRnAV6veEaz/MVPM9XsCw7pWKYBpqmj965M+kotBVn0DR9lFNzezbV1fW1nT2zubxiaZHd4Vzham//+SfX6c+qa2pyzGbzsqudnXvmZB7Iy8r+BQCWAkD9sqqq0Plz577CGLtvegbs93KL8ws0GOMWURTf6x8avDLr3/CJqqqV98a0PF/r8/memt4vLS37qKTY1rVh3frcUrujzbFkSSenVn8uiuImjVaz9+X6en7WAibC4S+cS0o8+Tm5VwDABgDAsqwvHA4FpznB8XEsRKN2QojpzuQkLwqiIzcvrwMAIBqJ7j185MjUrAWYzeYay8K0ZrVGsw8hNAgAEAwEugoKCy/O6Sd5v4NTLlc3AHTfrYG3Zxw6pnuFEFVjjLUAALIkJQAACouLUvqHBh9+JNv1WqMaISQAgDsjMzPVM+DhAcCNMY45y0ov8zpdZHDA8y2tUnllWXb39fVdY1k26hv17Ww+dKhhfu6fx/8evwMiLszqFMOGnQAAAABJRU5ErkJggg==';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=PizzaHut.loadJobs(); title="PizzaHut 2" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };
    $(document).ready(function () {
        try {
            PizzaHut.loadLanguage();
            PizzaHut.loadSets(function () { });
            PizzaHut.reloadSetttings(null);
            PizzaHut.createMenuIcon();
            PizzaHut.automation();
        } catch (e) {
            //console.log("exception occured");
        }
    });
})();