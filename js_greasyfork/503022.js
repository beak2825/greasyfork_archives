// ==UserScript==
// @name         Miner
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  miner helps you automation collecting products
// @author       RockefelleR
// @include https://*.the-west.*/game.php*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVDbDcMgDPz3FB3BL4gZhyRE6gYdvyY4VYhqiePssw5jaJ/3Aa8eTAqaFsslZ/TQooWrE8MR9URCPTESvMhUh5/AXhK/ZaSWo/+qE05OVJ2lm5FtIayzUDT87WEUD0mfiJ3sYVTCSHgIFAZ1fAtzseX+hbXhHDYOdDg2Lr2W1qE9c118e3vyd4S5CQk6itgYQPpRkOrEHEmkN/pdvakjC8ckvpB/e7oCvnN1Wkanz7gxAAABhGlDQ1BJQ0MgcHJvZmlsZQAAeJx9kT1Iw0AcxV9TpUVaHNpBRCRDdbKLijqWKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APE2cFJ0UVK/F9aaBHjwXE/3t173L0DhGaVqWZfDFA1y0gn4mIuvyr6XuFHECGMYlZipp7MLGbhOr7u4eHrXZRnuZ/7cwSVgskAj0gcY7phEW8Qz2xaOud94jArSwrxOfGEQRckfuS63OY3ziWHBZ4ZNrLpeeIwsVjqYbmHWdlQiaeJI4qqUb6Qa7PCeYuzWq2zzj35CwMFbSXDdZojSGAJSaQgQkYdFVRhIUqrRoqJNO3HXfzDjj9FLplcFTByLKAGFZLjB/+D392axanJdlIgDvS/2PbHGODbBVoN2/4+tu3WCeB9Bq60rr/WBOY+SW90tcgRMLgNXFx3NXkPuNwBhp50yZAcyUtTKBaB9zP6pjwQugUG1tq9dfZx+gBkqavlG+DgEBgvUfa6y7v9vb39e6bT3w/123LbhZ1k/AAADlVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6ZTNjYWFlYjYtNWE3ZC00ZWIxLWE3ZWQtMTk1NGE5YmE3N2M1IgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA1YzliNTcyLTlhZmMtNDQ5NS1iYmYxLWIyMGMwYTA1Zjc4NyIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmZkZTM2MDE3LTg1NjctNGZiNy1hNzBhLTY3MjRjZmM0ZTQyNCIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzIzNTc3NDgyNjQzNDc0IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzgiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0OjA4OjEzVDIxOjMxOjIyKzAyOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNDowODoxM1QyMTozMToyMiswMjowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjM5MWI1MmI0LTk1YWQtNDNlOC1iOWY1LTJmMWE2MWEyM2I5MyIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChXaW5kb3dzKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wOC0wOFQxOTo1NzozMyIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NTZhNmVjZi1kMmQzLTRlYmUtODUzZi0zMmMzYzkwODAzMDAiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjQtMDgtMTNUMjE6MzE6MjIiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+iwLe2AAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+gIDRMfFtM3BrUAAAIlSURBVDjLxZLbS5NxGMe/v8P7bntXm07LQ3NJohfe5AlBrcBVBNJNRHjAqy77E/oTgm4i+gOCbrqplmjICMI2h4mOggaZpWXbOuw8976+p18XkU1x4l3fiweeh+f5wPfLQ1BDytBZahAQAgDiT9EX31r790h1c3PMT7N5lb4Tzfjp8jwSBAMQAqAUhBBL0vTBzMKbfPUNr24Yofe4JF2XiAMtt6Z9gjFZmCZYvRfKaT+2bt9Z9Q73dhWiq8aBgFii4L082NK8c+Ua1iQJxfkFo7K5JQhnoLJskmLpfPXxHoBnqMf1rdEnzQYvggUCaHs+J07FY2ObQnmdpLJNBLAdWdH3Z7ALEJzfbRy/egN1HtiPZ3InPkXdhmTMOrTKpTM6jcwvJ62DwqbVEViFMi2/WkIqsT4d/5B52t6i2F43DQPGSHCgnR0KIADAKEAA27KtHQNTs4vfQ5QQu8EjhZ1MGxntC9CaAAFAaqwH9xwDAKwnK9a2Zk/GP+ZDbU1O2+0iYYmq50b7mkgNC2KNupw/mKK8B5ADgI20aqm6mJyJpp9JnIiTPjns4NaFYP8/yK4v/Usqqn1N0kpi7UExshL7O8+VDHHczZ9k8np3b1dd97ZqjZumtRRo9nzeSJX3fuJh6mhVmMzJw55O74RTZsXkL21KNfkLdlRArmSIOrcjVFbNzi6/0q+bYphTfv/IAADIlnTb6ZTn0lmtoaPVvSw7XC/x3/Ubu1fYJmp2HyUAAAAASUVORK5CYII=
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/503022/Miner.user.js
// @updateURL https://update.greasyfork.org/scripts/503022/Miner.meta.js
// ==/UserScript==

(function () {
    function JobPrototype(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.silver = false;
        this.distance = 0;
    };


    function TownPrototype(id, x, y, name) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.name = name;
    };

    JobPrototype.prototype = {
        setSilver: function (isSilver) {
            this.silver = isSilver;
        },
        calculateDistance: function () {
            this.distance = Map.calcWayTime({ x: this.x, y: this.y }, Character.position);
        }
    };

    Miner = {
        window: null,
        jobsLoaded: false,
        allTowns: [],
        allJobs: [],
        addedJobs: [],
        addedHotels: null,
        jobTablePosition: { content: "0px", scrollbar: "0px" },
        addedJobTablePosition: { content: "0px", scrollbar: "0px" },
        hotelTablePosition: { content: "0px", scrollbar: "0px" },
        addedHotelTablePosition: { content: "0px", scrollbar: "0px" },
        states: ["idle", "running", "waiting for a consumable cooldown"],
        jobFilter: { filterOnlySilver: false, filterNoSilver: false, filterCenterJobs: false, filterJob: "" },
        hotelFilter: { filterHotel: "" },
        isRunning: false,
        autoStart: false,
        lastJobHotel: false,
        autoCollect: false,
        firstOpened: false,
        settings: {
            autoStart: false,
            lastJobHotel: false,
            autoCollect: false,
        },
    };
    Miner.isNumber = function (potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };

    Miner.generateRandomNumber = function (min, max) {
        var minN = Math.min(min, max);
        var maxN = Math.max(min, max);
        var number = Math.floor((minN + Math.random() * (maxN - minN + 1)));
        return number;
    }

    Miner.loadJobs = async function () {
        if (!Miner.jobsLoaded) {
            new UserMessage("Kopac, kopac torf do ogrzania jajeczek", UserMessage.TYPE_HINT).show();

            // Pobieranie danych minimapy
            const mapData = await new Promise((resolve, reject) => {
                Ajax.get('map', 'get_minimap', {}, function (r) {
                    resolve(r);
                });
            });

            const params = {
                page: 0,
                tab: 'cities',
                entries_per_page: 9999
            };

            // Pobieranie danych o miastach
            const rankingData = await new Promise((resolve, reject) => {
                Ajax.get('ranking', 'get_data', params, function (r) {
                    resolve(r);
                });
            });

            var towns = [];
            for (var i = 0; i < rankingData.ranking.length; i++) {
                towns.push(new TownPrototype(
                    rankingData.ranking[i].town_id,
                    rankingData.ranking[i].town_x,
                    rankingData.ranking[i].town_y,
                    rankingData.ranking[i].town_name
                ));
            }
            Miner.allTowns = towns;

            var tiles = [];
            var jobs = [];
            var index = 0;
            var currentLength = 0;
            var maxLength = 299;

            for (var jobGroup in mapData.job_groups) {
                var group = mapData.job_groups[jobGroup];
                var jobsGroup = JobList.getJobsByGroupId(parseInt(jobGroup));

                for (var tilecoord = 0; tilecoord < group.length; tilecoord++) {
                    var xCoord = Math.floor(group[tilecoord][0] / Map.tileSize);
                    var yCoord = Math.floor(group[tilecoord][1] / Map.tileSize);

                    if (currentLength === 0) {
                        tiles[index] = [];
                    }
                    tiles[index].push([xCoord, yCoord]);
                    currentLength++;

                    if (currentLength === maxLength) {
                        currentLength = 0;
                        index++;
                    }

                    for (var i = 0; i < jobsGroup.length; i++) {
                        jobs.push(new JobPrototype(group[tilecoord][0], group[tilecoord][1], jobsGroup[i].id));
                    }
                }
            }

            // Ładowanie danych na mapie
            await new Promise((resolve, reject) => {
                let toLoad = tiles.length;
                let loaded = 0;

                for (let blocks = 0; blocks < tiles.length; blocks++) {
                    Map.Data.Loader.load(tiles[blocks], function () {
                        loaded++;
                        if (loaded === toLoad) {
                            Miner.jobsLoaded = true;
                            Miner.allJobs = jobs;
                            Miner.createWindow();
                            resolve();
                        }
                    });
                }
            });

        } else {
            Miner.createWindow();
        }
    };


    Miner.loadJobData = function (callback) {
        Ajax.get('work', 'index', {}, function (r) {
            if (r.error) {
                //console.log(r.error);
                return;
            }
            JobsModel.initJobs(r.jobs);
            callback();
        });
    };

    Miner.getJobName = function (id) {
        return JobList.getJobById(id).name;
    };

    Miner.getJobIcon = function (silver, id, x, y) {
        var html = '<div class="centermap" onclick="Map.center(' + x + ',' + y + ');"style="position: absolute;background-image: url(\'../images/map/icons/instantwork.png\');width: 20px;height: 20px;top: 0;right: 3px;cursor: pointer;"></div>';
        var silverHtml = "";
        if (silver) {
            silverHtml = '<div class="featured silver"></div>';
        }
        return '<div class="job" style="left: 0; top: 0; position: relative;"><div  onclick="" class="featured"></div>' + silverHtml + html + '<img src="../images/jobs/' + JobList.getJobById(id).shortname + '.png" class="job_icon"></div>';
    };

    Miner.getHotelIcon = function (room, id, x, y) {
        var html = '<div class="centermap" onclick="Map.center(' + x + ',' + y + ');"style="position: absolute;background-image: url(\'../images/map/icons/instantwork.png\');width: 20px;height: 20px;top: 0;right: 3px;cursor: pointer;"></div>';

        return '<div class="hotel" style="left: 0; top: 0; position: relative;"><div  onclick="" class="featured"></div>' + html + '<img src="../images/jobs/sleep/sleep1.png" class="hotel_icon"></div>';
    };

    Miner.checkIfSilver = function (x, y, id) {
        var key = x + "-" + y;
        var jobData = Map.JobHandler.Featured[key];
        if (jobData == undefined || jobData[id] == undefined) {
            return false;
        } else {
            return jobData[id].silver;
        }
    };



    Miner.compareUniqueJobs = function (job, jobs) {
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


    Miner.findJob = function (x, y, id) {
        for (var i = 0; i < Miner.allJobs.length; i++) {
            if (Miner.allJobs[i].id == id && Miner.allJobs[i].x == x && Miner.allJobs[i].y == y) {
                return Miner.allJobs[i];
            }
        }
    };

    Miner.getAllUniqueJobs = function () {
        var jobs = [];
        for (var i = 0; i < Miner.allJobs.length; i++) {
            var currentJob = Miner.allJobs[i];
            if (Miner.jobFilter.filterJob != "") {
                if (!Miner.getJobName(currentJob.id).toLowerCase().includes(Miner.jobFilter.filterJob)) {
                    continue;
                }
            }
            if (!JobList.getJobById(currentJob.id).canDo()) {
                continue;
            }
            var isSilver = Miner.checkIfSilver(currentJob.x, currentJob.y, currentJob.id);
            currentJob.silver = isSilver;
            currentJob.calculateDistance();
            if (isSilver && Miner.jobFilter.filterNoSilver) {
                continue;
            }
            if (!isSilver && Miner.jobFilter.filterOnlySilver) {
                continue;
            }
            if (Miner.jobFilter.filterCenterJobs && currentJob.id < 131) {
                continue;
            }
            Miner.compareUniqueJobs(currentJob, jobs);
        }

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
        if (Miner.sortJobTableXp == 1) {
            jobs.sort(experienceSort);
        }
        if (Miner.sortJobTableXp == -1) {
            jobs.sort(reverseExperienceSort);
        }
        if (Miner.sortJobTableDistance == 1) {
            jobs.sort(distanceSort);
        }
        if (Miner.sortJobTableDistance == -1) {
            jobs.sort(reverseDistanceSort);
        }
        return jobs;
    };

    Miner.isNumber = function (potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };

    Miner.automaticalStart = function () {
        if (Miner.settings.autoStart) {
            function delay() {
                Miner.doAction();
            }
            setTimeout(delay, 2000);
        }
    }

    Miner.doAction = async function () {
        if (Miner.addedJobs.length == 0) {
            new UserMessage("Co ja mam ci kopac? Wybierz pracke", UserMessage.TYPE_HINT).show();
            await new Promise(r => setTimeout(r, 1000));
            new UserMessage("Co ja mam ci kopac? Wybierz pracke!", UserMessage.TYPE_HINT).show();
            return;
        }
        if (!Miner.jobsLoaded) {
            await Miner.loadJobs();
            while (!Miner.firstOpened) {
                await new Promise(r => setTimeout(r, 1));
            }
            await new Promise(r => setTimeout(r, 1700));
            wman.close("Miner");
        }
        var limitJobs = Premium.hasBonus('automation') ? 9 : 4;
        var maxJobs = parseInt(Character.energy / 12);
        if (maxJobs >= 9) {
            maxJobs = 9;
        }
        if (maxJobs != 0) {
            if (TaskQueue.queue.length != 0) {
                if (Miner.settings.lastJobHotel) {
                    if (TaskQueue.queue.length != limitJobs) {
                        if (TaskQueue.queue.length == 1 && TaskQueue.queue[0].type != "job") {
                            TaskQueue.cancel(TaskQueue.queue.length - 1);
                        }
                        else if (TaskQueue.queue.length > 1) {
                            TaskQueue.cancel(TaskQueue.queue.length - 1);
                        }

                    }
                }
                limitJobs = limitJobs - TaskQueue.queue.length;
                await new Promise(r => setTimeout(r, 900));
            }
            if (Miner.settings.lastJobHotel) {
                if (Premium.hasBonus('automation') && maxJobs == 9) {
                    limitJobs = limitJobs - 1;
                    maxJobs = maxJobs - 1;
                }
                if (!Premium.hasBonus('automation') && maxJobs == 4) {
                    limitJobs = limitJobs - 1;
                    maxJobs = maxJobs - 1;
                }
            }

            var choosenJobs = 0;

            choosenJobs = Miner.allJobs.filter(function (job) {
                return job.silver === true && job.id == Miner.addedJobs[0].id;
            });

            if (choosenJobs == 0) {
                choosenJobs = Miner.allJobs.filter(function (job) {
                    return job.id == Miner.addedJobs[0].id;
                });
            }

            var closestJob = choosenJobs.reduce(function (prev, curr) {
                return (prev.distance < curr.distance) ? prev : curr;
            }, choosenJobs[0]);

            //console.log(closestJob);

            var jobsCount = Math.min(maxJobs, limitJobs);

            for (var i = 0; i < jobsCount; i++) {
                JobWindow.startJob(closestJob.id, closestJob.x, closestJob.y, 3600);
            }
            await new Promise(r => setTimeout(r, 300));

            if (Miner.settings.lastJobHotel) {
                HotelWindow.townid = Miner.addedHotels;
                HotelWindow.start("bedroom");
            }
            await new Promise(r => setTimeout(r, 300));
        }
    };

    Miner.selectTab = function (key) {
        Miner.window.tabIds[key].f(Miner.window, key);
    };

    Miner.removeActiveTab = function (window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };

    Miner.addActiveTab = function (key, window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };

    Miner.removeWindowContent = function () {
        $(".Miner2window").remove();
    };

    Miner.createJobsTab = function () {
        var htmlSkel = $("<div id = \'jobs_overview'\></div>");
        var html = $("<div class = \'jobs_search'\ style=\'position:relative;'\><div id=\'jobFilter'\style=\'position:absolute;top:10px;left:15px'\></div><div id=\'job_only_silver'\style=\'position:absolute;top:10px;left:200px;'\></div><div id=\'job_no_silver'\style=\'position:absolute;top:10px;left:270px;'\></div><div id=\'job_center'\style=\'position:absolute;top:10px;left:350px;'\></div><div id=\'button_filter_jobs'\style=\'position:absolute;top:5px;left:350px;'\></div><div id=\'button_clear_jobs'\style=\'position:absolute;top:5px;left:450px;'\></div></div>");
        var table = new west.gui.Table();
        var uniqueJobs = Miner.getAllUniqueJobs();
        var selectedValue = 0
        table.addColumn("jobIcon", "jobIcon").addColumn("jobName", "jobName").addColumn("jobAdd", "jobAdd");
        table.appendToCell("head", "jobIcon", "Job icon").appendToCell("head", "jobName", "Job name").appendToCell("head", "jobAdd", "");
        for (var job = 0; job < uniqueJobs.length; job++) {
            for (var i = 0; i < Miner.addedJobs.length; i++) {
                if (uniqueJobs[job].id === Miner.addedJobs[i].id) {
                    //console.log("To ta praca o id");
                    selectedValue = Miner.addedJobs[i].id
                    //console.log(Miner.addedJobs[i].id);
                }
            }
            if (selectedValue == uniqueJobs[job].id) {
                table.appendRow().appendToCell(-1, "jobIcon", Miner.getJobIcon(false, uniqueJobs[job].id, uniqueJobs[job].x, uniqueJobs[job].y)).appendToCell(-1, "jobName", Miner.getJobName(uniqueJobs[job].id));
            }
        }
        for (var job = 0; job < uniqueJobs.length; job++) {
            if (selectedValue != uniqueJobs[job].id) {
                table.appendRow().appendToCell(-1, "jobIcon", Miner.getJobIcon(false, uniqueJobs[job].id, uniqueJobs[job].x, uniqueJobs[job].y)).appendToCell(-1, "jobName", Miner.getJobName(uniqueJobs[job].id)).appendToCell(-1, "jobAdd", Miner.createAddJobButton(uniqueJobs[job].x, uniqueJobs[job].y, uniqueJobs[job].id));
            }
        }
        var textfield = new west.gui.Textfield("jobsearch").setPlaceholder("Select job name");
        if (Miner.jobFilter.filterJob != "") {
            textfield.setValue(Miner.jobFilter.filterJob);
        }
        var buttonFilter = new west.gui.Button("Filter", function () {
            Miner.jobFilter.filterJob = textfield.getValue();
            Miner.jobTablePosition.content = "0px";
            Miner.jobTablePosition.scrollbar = "0px";
            Miner.selectTab("jobs");
        });
        var buttonClear = new west.gui.Button("unSelect", function () {
            Miner.addedJobs = []
            Miner.jobTablePosition.content = "0px";
            Miner.jobTablePosition.scrollbar = "0px";
            Miner.selectTab("jobs");
        });



        htmlSkel.append(table.getMainDiv());
        $('#jobFilter', html).append(textfield.getMainDiv());
        $("#button_filter_jobs", html).append(buttonFilter.getMainDiv());
        $("#button_clear_jobs", html).append(buttonClear.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };

    Miner.createAddJobButton = function (x, y, id) {
        var buttonAdd = new west.gui.Button("Select", function () {
            Miner.addJob(x, y, id);
            Miner.AktualnyX = x
            Miner.AktualnyY = y
            Miner.jobTablePosition.content = $(".Miner2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            Miner.jobTablePosition.scrollbar = $(".Miner2window .tw2gui_scrollbar_pulley").css("top");
            Miner.selectTab("jobs");
        });
        buttonAdd.setWidth(100);
        return buttonAdd.getMainDiv();
    };

    Miner.addJob = function (x, y, id) {
        Miner.addedJobs = []
        Miner.addedJobs.push(Miner.findJob(x, y, id));
    };



    Miner.createHotelsTab = function () {
        var htmlSkel = $("<div id = \'hotels_overview'\></div>");
        var html = $("<div class = \'hotels_search'\ style=\'position:relative;'\><div id=\'hotelFilter'\style=\'position:absolute;top:10px;left:15px'\></div><div id=\'button_filter_hotels'\style=\'position:absolute;top:5px;left:350px;'\></div><div id=\'button_clear_hotels'\style=\'position:absolute;top:5px;left:450px;'\></div></div>");
        var table = new west.gui.Table();
        var selectedValue = 0
        table.addColumn("hotelIcon", "hotelIcon").addColumn("hotelName", "hotelName").addColumn("hotelAdd", "hotelAdd");
        table.appendToCell("head", "hotelIcon", "Hotel icon").appendToCell("head", "hotelName", "Hotel name").appendToCell("head", "hotelAdd", "");

        if (Miner.addedHotels != null) {
            for (var hotel = 0; hotel < Miner.allTowns.length; hotel++) {
                if (Miner.allTowns[hotel].name.toLowerCase().includes(Miner.hotelFilter.filterHotel)) {
                    if (Miner.allTowns[hotel].id == Miner.addedHotels) {
                        table.appendRow().appendToCell(-1, "jobIcon", Miner.getHotelIcon("bedroom", "3", Miner.allTowns[hotel].x, Miner.allTowns[hotel].y)).appendToCell(-1, "hotelName", Miner.allTowns[hotel].name);

                    }
                }
            }
        }

        for (var hotel = 0; hotel < Miner.allTowns.length; hotel++) {
            if (Miner.allTowns[hotel].name.toLowerCase().includes(Miner.hotelFilter.filterHotel)) {
                if (Miner.allTowns[hotel].id != Miner.addedHotels) {
                    table.appendRow().appendToCell(-1, "jobIcon", Miner.getHotelIcon("bedroom", "3", Miner.allTowns[hotel].x, Miner.allTowns[hotel].y)).appendToCell(-1, "hotelName", Miner.allTowns[hotel].name).appendToCell(-1, "hotelAdd", Miner.createAddHotelButton(Miner.allTowns[hotel].id));
                }
            }
        }



        var textfield = new west.gui.Textfield("hotelsearch").setPlaceholder("Select city name");

        if (Miner.hotelFilter.filterHotel != "") {
            textfield.setValue(Miner.hotelFilter.filterHotel);
        }


        var buttonFilterHotel = new west.gui.Button("Filter", function () {
            Miner.hotelFilter.filterHotel = textfield.getValue();
            Miner.hotelTablePosition.content = "0px";
            Miner.hotelTablePosition.scrollbar = "0px";
            Miner.selectTab("hotels");
        });

        var buttonClearHotel = new west.gui.Button("unSelect", function () {
            Miner.addedHotels = null
            Miner.hotelTablePosition.content = "0px";
            Miner.hotelTablePosition.scrollbar = "0px";
            Miner.selectTab("hotels");
        });



        htmlSkel.append(table.getMainDiv());
        $('#hotelFilter', html).append(textfield.getMainDiv());
        $("#button_filter_hotels", html).append(buttonFilterHotel.getMainDiv());
        $("#button_clear_hotels", html).append(buttonClearHotel.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };


    Miner.createAddHotelButton = function (id) {
        var buttonAdd = new west.gui.Button("Select", function () {
            Miner.addHotel(id);
            Miner.hotelTablePosition.content = $(".Miner2window .tw2gui_scrollpane_clipper_contentpane").css("top");
            Miner.hotelTablePosition.scrollbar = $(".Miner2window .tw2gui_scrollbar_pulley").css("top");
            Miner.selectTab("hotels");
        });
        buttonAdd.setWidth(100);
        return buttonAdd.getMainDiv();
    };

    Miner.addHotel = function (id) {
        Miner.addedHotels = null
        Miner.addedHotels = id;
    };


    Miner.collectDaily = function () {
        if (Miner.settings.autoCollect) {
            if (Player.hasLoginBonus) {
                console.log(
                    "Trwa odbieranie bonusu"
                );
                var playerH = Player.h;
                function delay() {
                    Ajax.remoteCall('loginbonus', 'collect', playerH, {}, function (r) {
                        console.log("Odebrano bonus");
                        console.log(r);
                    });
                    $(".tw2gui_dialog_framefix").remove();
                }
                setTimeout(delay, 1000);
                $(".tw2gui_dialog_framefix").remove();
            }
            else {
                console.log("Dzienny bonus był odebrany");
            }
        }
    };


    Miner.createSettingsGui = function () {
        var htmlSkel = $("<div id=\'settings_overview'\ style = \'padding:10px;'\></div>");

        var checkboxAutoStart = new west.gui.Checkbox();
        checkboxAutoStart.setLabel("Auto start");
        checkboxAutoStart.setSelected(Miner.settings.autoStart);
        checkboxAutoStart.setCallback(function () {
            Miner.settings.autoStart = !Miner.settings.autoStart;
        });

        var checkboxLastJobHotel = new west.gui.Checkbox();
        checkboxLastJobHotel.setLabel("Last job hotel");
        checkboxLastJobHotel.setSelected(Miner.settings.lastJobHotel);
        checkboxLastJobHotel.setCallback(function () {
            Miner.settings.lastJobHotel = !Miner.settings.lastJobHotel;
        });

        var checkboxAutoCollect = new west.gui.Checkbox();
        checkboxAutoCollect.setLabel("Auto collect daily bonus");
        checkboxAutoCollect.setSelected(Miner.settings.autoCollect);
        checkboxAutoCollect.setCallback(function () {
            Miner.settings.autoCollect = !Miner.settings.autoCollect;
        });



        var buttonApply = new west.gui.Button("Save all settings", function () {
            Miner.settings.autoStart = checkboxAutoStart.isSelected();
            Miner.settings.lastJobHotel = checkboxLastJobHotel.isSelected();
            Miner.settings.autoCollect = checkboxAutoCollect.isSelected();
            Miner.setSettings();
            Miner.selectTab("settings");
        })

        htmlSkel.append(checkboxAutoStart.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxLastJobHotel.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(checkboxAutoCollect.getMainDiv());
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        return htmlSkel;
    };


    Miner.setSettings = function () {
        var temporaryObject = {
            addedJobs: Miner.addedJobs,
            addedHotels: Miner.addedHotels,
            settings: Miner.settings
        };
        var jsonTemporary = JSON.stringify(temporaryObject);
        //console.log(jsonTemporary);
        const encrypted = CryptoJS.AES.encrypt(jsonTemporary, 'Slysz').toString();
        localStorage.setItem('miner', encrypted);
    };

    Miner.getSettings = function () {
        var settingsG = 0;
        if (localStorage.getItem('miner')) {
            var storageLog = localStorage.getItem('miner')
            var decrypted = CryptoJS.AES.decrypt(storageLog, 'Slysz').toString(CryptoJS.enc.Utf8);
            settingsG = decrypted;
            console.log(
                "Reading a config"
            )
        }

        if (settingsG != 0) {
            var tempObject = JSON.parse(settingsG);
            var tmpAddedJobs = tempObject.addedJobs;
            for (var j = 0; j < tmpAddedJobs.length; j++) {
                var jobP = new JobPrototype(tmpAddedJobs[j].x, tmpAddedJobs[j].y, tmpAddedJobs[j].id);
                jobP.setSilver(tmpAddedJobs[j].silver);
                jobP.distance = tmpAddedJobs[j].distance;
                Miner.addedJobs.push(jobP);
            }
            var tmpAddedHotels = tempObject.addedHotels;
            Miner.addedHotels = tmpAddedHotels;

            var tmpSettings = tempObject.settings;
            Miner.settings.autoStart = tmpSettings.autoStart;
            Miner.settings.lastJobHotel = tmpSettings.lastJobHotel;
            Miner.settings.autoCollect = tmpSettings.autoCollect;
        }
        console.log("Config loaded");
    };


    Miner.createWindow = async function () {
        var window = wman.open("Miner").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("Miner");
        var content = $('<div class=\'Miner2window\'/>');
        var tabs = {
            "jobs": "Jobs",
            "hotels": "Hotels",
            "settings": "Settings"
        };
        var tabLogic = function (win, id) {
            var content = $('<div class=\'Miner2window\'/>');
            switch (id) {
                case "jobs":
                    Miner.loadJobData(function () {
                        Miner.removeActiveTab(this);
                        Miner.removeWindowContent();
                        Miner.addActiveTab("jobs", this);
                        content.append(Miner.createJobsTab());
                        Miner.window.appendToContentPane(content);
                        Miner.addJobTableCss();
                        $(".Miner2window .tw2gui_scrollpane_clipper_contentpane").css({ "top": Miner.jobTablePosition.content });
                        $(".Miner2window .tw2gui_scrollbar_pulley").css({ "top": Miner.jobTablePosition.scrollbar });
                    });
                    break;
                case "hotels":
                    Miner.removeActiveTab(this);
                    Miner.removeWindowContent();
                    Miner.addActiveTab("hotels", this);
                    content.append(Miner.createHotelsTab());
                    Miner.window.appendToContentPane(content);
                    Miner.addHotelTableCss();
                    $(".Miner2window .tw2gui_scrollpane_clipper_contentpane").css({ "top": Miner.hotelTablePosition.content });
                    $(".Miner2window .tw2gui_scrollbar_pulley").css({ "top": Miner.hotelTablePosition.scrollbar });
                    break;
                case "settings":
                    Miner.removeActiveTab(this);
                    Miner.removeWindowContent();
                    Miner.addActiveTab("settings", this);
                    content.append(Miner.createSettingsGui());
                    Miner.window.appendToContentPane(content);
                    Miner.settingsTableCss();
                    break;
            }
        }
        for (var tab in tabs) {
            window.addTab(tabs[tab], tab, tabLogic);
        }
        Miner.window = window;
        Miner.selectTab("jobs");
        if (!Miner.firstOpened) {
            Miner.firstOpened = true;
        }
        return new Promise(resolve => {
            resolve();
        });
    };

    Miner.addJobTableCss = function () {
        $(".Miner2window .jobIcon").css({ "width": "80px" });
        $(".Miner2window .jobName").css({ "width": "150px" });
        $(".Miner2window .jobXp").css({ "width": "40px" });
        $(".Miner2window .jobMoney").css({ "width": "40px" });
        $(".Miner2window .jobMotivation").css({ "width": "40px" });
        $(".Miner2window .jobDistance").css({ "width": "100px" });
        $(".Miner2window .row").css({ "height": "60px" });
        $('.Miner2window').find('.tw2gui_scrollpane').css('height', '250px');
    };

    Miner.addHotelTableCss = function () {
        $(".Miner2window .hotelIcon").css({ "width": "100px" });
        $(".Miner2window .hotelName").css({ "width": "150px" });
        $(".Miner2window .row").css({ "height": "80px" });
        $('.Miner2window').find('.tw2gui_scrollpane').css('height', '250px');
    };

    Miner.settingsTableCss = function () {
        $(".Miner2window #settings_overview").css({
            "text-align": "center"
        });
        $(".Miner2window #settings_overview .tw2gui_checkbox").css({
            "font-size": "14px",
            "font-weight": "bold",
            "text-align": "center",
            "margin": "20px 20px 20px 20px"
        });
    };

    Miner.createMenuIcon = function () {
        var menuimage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAxXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVDbDcMwCPz3FB3B5ogN4ziPSt2g4xcHEiVRkXw8Dp2BtH0/7/QaRoUTT02q1prNWFmpWyDZre9YMu/oiQZX7vV0EmQlmIenUqP/qJdTwF23aLoIyRLEfCeUQ18eQuQOY6IRryGkIQRyooRA97VyVWnXFeYt3038pQG0RFs0P3Nudr11sn9AtKEgGwLiA2A8TugWiCFZkw2MZnGBGgLHqnaQf3c6LP0AHZdZfoc6PoAAAAGFaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1ulRSpFLCLikKE6WQcVcSxVLIKF0lZo1cHk0i9o0pCkuDgKrgUHPxarDi7Oujq4CoLgB4izg5Oii5T4v6TQIsaD4368u/e4ewd4m1WmGD0xQFFNPZ2IC7n8quB/RQBDCGEAkyIztGRmMQvX8XUPD1/vojzL/dyfo18uGAzwCMQxpukm8Qbx7Kapcd4nDrOyKBOfE0/odEHiR65LDr9xLtns5ZlhPZueJw4TC6UulrqYlXWFeIY4Iisq5XtzDsuctzgr1Tpr35O/MFhQVzJcpzmKBJaQRAoCJNRRQRUmorSqpBhI037cxT9i+1PkkshVASPHAmpQINp+8D/43a1RnJ5ykoJxoPfFsj7GAP8u0GpY1vexZbVOAN8zcKV2/LUmMPdJeqOjRY6A0DZwcd3RpD3gcgcYftJEXbQlH01vsQi8n9E35YHBW6BvzemtvY/TByBLXS3fAAeHwHiJstdd3h3o7u3fM+3+fgDLmnLK2/lHawAADXZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6NGViOTQ0MzYtZmVkZi00ZThmLTk3N2UtODk0ZDVjOTkxNGI4IgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYwZTFlODgwLWY0YWEtNGQ0Ni05YmZlLTY3MzA3NjM2NGJiMyIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjY4YjQ0ZmIwLTU4ZWEtNDhiMC04NGFiLTE2NTIzZDg0YmE0YiIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzI0MzM5OTc2ODQyNDU5IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzgiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0OjA4OjIyVDE3OjE5OjM1KzAyOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyNDowODoyMlQxNzoxOTozNSswMjowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNhN2QwODJhLWYyNTctNDI0Ni1hOWE5LWRkNTdiMzkwOTVmNyIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChXaW5kb3dzKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyNC0wOC0yMlQxNzoxOTozNiIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz6HxdrOAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH6AgWDxMkJXGSswAAA0tJREFUSMftlU2P21QUht9rO046zsdMpkkGpWg+gCJ5wiCN6ixA1UhlgRAs5icEid/EOquKVVUQCwRqWUBaZMMgFdWlFDLTVmq+hsZpbMf2tX1YzJRO2gacqmLFu7k6lu997nnP0T3AfyCW5KeiVlMcOaUyAESAyBiICDhehTA0Xf0XZ9Z+KQmEi5IqSyl91i2JqA7AmAvyyUcbzTD01c6fHu7IVUy2t5T8BzuIHjkgzgEGiPkshGwW6ZUShp992RQl0bC++6mRGDLxA1Vk0MoFGb3qKsLSMlhOAXNcEGdHnj3WkWvT35JA9FtDvFFdwM7WEoY772CSPw0a2nj0TQvu7fbRycflZAC47zUmP9yYz65hdQPtN9eBC+fRLVVQsF3kvvgKp2y3cZtzkzEBRDEEQUAcx4h9bv5TTacglXNvK5YsqOnttxS3VMTvSh6S56E4GiH/2zWkwwjLQeRc2bPMeVp4CuJKUNMpSS++fx5RIYfIshFdvATcuIbKeg49K2hGsWQAqL8whDEGAhCNHZDr4+HV75EZuw3XD3Fzf9Ss18oQGKmIQz2TW/3482/3biaBCCcDIgIDA/EI8AL4v/6B0aFlHo640R8GRhSTQwRlISNp3L5/7sJWUZ07E4CB8FQrEnCv75sA6nS9o5cXU9rmWh59K2iGxBJZJz1zIgApr5yInkDDIGxMfGi3DkZNbfPYOhbrYYjG1Z8PzUR2Pe57MadAzGWfedravcB8OI6NnsWNiMiJiRQlI2qZFGnvbc+2brrwYAAY0pXyk8TYNGi/4x1Z1+ro5SVZq60V0Bt6zZBopnXiySBfLo0mgnCZXOfdsXlnYLfvfih7nul1DvnTG3NptFKSaFhjf7f2+hJeWZYXsxm2e6aitO523cFMiNvp8/B+5wGL47p/cO+B3dr79HkAALDceCCnwH2O+mvV7KLImGK7YZUoNlZLGb7f8wZzzZN/09kzil5eSmm1tRx6VgBnQsbXP/brz83kRVVYYC1RhDGy+W5to4iV0+nF7Clh99WVhdZBxx1ILwPS7gbmOkTYE25EMakig6JkRE3mpCSejEm0352YAOq43tUrRVnbXMsi4AJeKuTvUc39RhQKShxw8Eg08b/m1V8v3owm6eUR/gAAAABJRU5ErkJggg==';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=Miner.loadJobs(); title="Miner" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };

    Miner.createMenuIconManual = function () {
        var menuimage = 'data:image/png;base64,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';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=Miner.doAction(); title="Start miner" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };
    $(document).ready(function () {
        try {
            Miner.getSettings();
            Miner.collectDaily();
            Miner.automaticalStart();
            Miner.createMenuIcon();
            Miner.createMenuIconManual();
        } catch (e) {
            console.log("exception occured");
        }
    });


})();