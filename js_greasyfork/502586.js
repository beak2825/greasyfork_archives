// ==UserScript==
// @name            Vajda Jožo
// @namespace       http://tampermonkey.net/
// @version         1.0.0
// @include         https://*.the-west.*/game.php*
// @exclude         https://*.events.the-west.*
// @description     d
// @icon        data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAMAAAC7faEHAAAAPFBMVEVrkJ96n66DiINcgIyrWj3mhGSGRzL4nX9zeXWQl5H+up7Mbk0VCgxdaWuiq6Q6JSOBYlZGSkxfNy2ufGj5kWvyAAACxElEQVR4nFWUCZLsKAxE2RHG7Pe/62QKV/8Ywu6y4ZGSUqaNsdYYXvjl7Y3n5T3n+dCaN2YAwYy1mPhwgwV/9ynHYRaewNtLcL2Z/wHU+biL6bBtjLGK+cSVVGDp6p3D0xp7vy8TMtxtNWF79TT3O9lGzDnX0T5Ew3iuK0dh1VszP8+T07JXztivnF9+npusGcrFQMFLaOAb92amaY6JuDGkAQ/sTeXzYZjrSdepiSIwhlhy326Nvn6t0HQduIP7Qtf8f/m5XlpzpNtMNYaQjDpQrPl5Db3umrjmei+9m1ZrmvVcg68vdJpx8eMKdjhni5sH/sW9y5/Nt4laLwtC68WhWDgTxxtzPPIDi78cUnNi/IFUfM5AuSfTnlMKAn1VLiOCd+cPHM41P3GM88TIthzMO3H++tL5ViYQqET2gwx3hdIFQy1fBmriutSoQxFAEXuC9FIKQJCIW2wpftZ6yXxJPobJWmEYhJZhVPEzfBxAWhMjnRTBIsHOOhw2pPTD/sCQUmuskSy4xocQQr1iLEgx9M91lRNyBdr9YDMCM7MalaspheCMB8OWan7NnRrGBZHXlRvgJqKJg8GXE0G544VkCDEjgVrDfvE2oQZI83PwyMEVnLSNWICQw95jg2PrHG/lUDe/dWFGUMIFMjm8sXNcVl9gy4mMEQgGvSEt0K5N5YAwPxGm7iaWg7JpD2w7MIrfAdZFfRYJ+akTOpti5GrdgrMXYaCwH0X7IaxywpuLAcTjAlextmCgY38FEeGXrKreJpWtYS0cqYWvBcdM2iB3IDHlDVELQVg0e60FeKPBrfUuA/X2A6XSXnSANbKFeb9r0Wgc2NmQ4jBIUmLdbvIfwYYWx3iHctIWxCBKzrkanNT53jH0715rIz8ebjjDegviBtzPfv+NiTp2ZR3Emn7PkmJtsCb/gTvn1MClhZjS5mrjP4VqJ9/Eb24oAAAAAElFTkSuQmCC
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/502586/Vajda%20Jo%C5%BEo.user.js
// @updateURL https://update.greasyfork.org/scripts/502586/Vajda%20Jo%C5%BEo.meta.js
// ==/UserScript==

window.sleep = async function(milliseconds) {  
    await new Promise(r => setTimeout(r, milliseconds))
}

window.Now = function() {
    return new ServerDate()
}

class Consumable {
    constructor(id = null, image = null, name = null) {
        this.id = id
        this.image = image
        this.name = name
        this.energy = 0
        this.motivation = 0
        this.health = 0
        this.isSelected_ = false
        this.count = 0
    }

    isCakeDecoration() {
        return this.id === 53339000
    }

    removeOne() {
        this.count -= 1

        if ( this.count === 0 ) {
            const consumables = ConsumablesManager.consumables
            const index = consumables.findIndex(c => c.id === this.id)
            consumables.splice(index, 1)
        }
        return this
    }

    setCount(valOrUpdater) {
        if ( typeof valOrUpdater === 'function' ) {
            this.count = valOrUpdater(this.count)
        } else {
            this.count = valOrUpdater
        }

        this.count = Math.max(0, this.count)
        return this
    }

    setEnergy(val) {
        this.energy = val
        return this
    }

    setMotivation(val) {
        this.motivation = val
        return this
    }

    setHealth(val) {
        this.health = val
        return this
    }

    setIsSelected(isSelected) {
        this.isSelected_ = isSelected
        return this
    }

    hasCooldown() {
        return this.energy > 0 || this.motivation > 0 || this.health > 0
    }

    getBuffHTML() {
        return '<strong>No Buffs</strong>'
    }

    get isSelected() {
        return this.isSelected_
    }

    import(properties) {
        this.isSelected_ = properties.isSelected
        this.energy = properties.energy
        this.motivation = properties.motivation
        this.health = properties.health
        this.image = properties.image
        this.count = properties.count
        this.name = properties.name
        this.id = properties.id

        if ( properties.buffs ) this.buffs = properties.buffs

        return this
    } 

    export() {
        return {
            isSelected: this.isSelected,
            energy: this.energy,
            motivation: this.motivation,
            health: this.health,
            image: this.image,
            count: this.count,
            name: this.name,
            id: this.id,
            buffs: this.buffs_ || null
        }
    }
}

class Buff extends Consumable {
    constructor(id, image, name, buffs) {
        super(id, image, name, buffs)
        this.buffs_ = buffs
    }

    getBuffImage() {
        return `https://westsk.innogamescdn.com/images/buffs/${this.getBuffType()}.jpg`
    }

    getBuffType() { 
        if ( this.buffs_?.travel && this.buffs_.travel !== 0 ) {
            return 'travel'
        }

        if ( this.buffs_?.character ) {
            for ( const key in this.buffs_.character ) {
                if ( this.buffs_.character[key] > 0 ) {
                    return 'character'
                }
            }
        }
        return 'none'
    }
    
    canUseAsBuff() {
        return CharacterSkills.buffs[this.getBuffType()] === null && !this.hasCooldown() 
    }

    getBuffHTML() {
        const containerStyle = `'
            display: grid;
            grid-template-columns: 30px auto;
        '`

        const imgContainerStyle = `'
            display: flex;
            padding-bottom: 5px;
        '`

        const buffsContainerStyle = `'
            display: grid;
            grid-template-rows: repeat(auto-fill, 15px);
            transform: translateY(5px)
        '`
        const buffs = this.buffs.reduce((acc, b) => acc.concat(`<p>${b}</p>`), '')

        const html = `
            <div style=${containerStyle}>
                <span style=${imgContainerStyle}>
                    <img style=align-self:end width=25px height=25px src=${this.getBuffImage()} alt='Buff Image'>
                </span>

                <span style=${buffsContainerStyle}>
                    ${
                        buffs
                    }
                </span>
            </div>
        `

        return html
    }

    removeOne() {
        this.count -= 1

        if ( this.count === 0 ) {
            const consumables = ConsumablesManager.consumables
            const buffs = ConsumablesManager.buffs
            let index = consumables.findIndex(c => c.id === this.id)
            if ( index !== -1 ) {
                consumables.splice(index, 1)
                return this
            }
            index = buffs.findIndex(b => b.id === this.id)
            if ( index !== -1 ) {
                buffs.splice(index, 1)
                if ( ConsumablesManager.getSelectedBuffs().some(b => b.id === this.id) ) {
                    ConsumablesManager.removeSelectedBuff(this)
                }
            }
        }
        return this
    }

    get isSelected() {
        return ConsumablesManager.getSelectedBuffs(this.getBuffType())?.id === this.id
    }

    get buffs() {
        if ( this.getBuffType() === 'travel' ) {
            return [`+${this.buffs_.travel}% speed`]
        }

        const buffs = []
        for ( const buff in this.buffs_.character ) {
            if ( this.buffs_.character[buff] > 0 ) {
                buffs.push(`+${this.buffs_.character[buff]}% ${buff}`)
            }  
        }
        return buffs
    }

    set buffs(buffs) {
        this.buffs_ = buffs
    }
}

class Job {
    constructor(x, y, id, groupId) {
        this.x = x
        this.y = y
        this.id = id
        this.groupId = groupId
        this.isSilver = false
        this.distances = []
        this.experience = 0
        this.money = 0
        this.motivation = 0
        this.stopMotivation = 75
        this.set = -1
        this.bestEquipment_ = undefined
    }

    setIsSilver(val) {
        this.isSilver = val
        return this
    }

    setExperience(val) {
        this.experience = val
        return this
    }

    setMoney(val) {
        this.money = val
        return this
    }

    setMotivation(valOrUpdater) {
        if ( typeof valOrUpdater === 'function' ) {
            this.motivation = valOrUpdater(this.motivation)
        } else {
            this.motivation = valOrUpdater
        } 

        Vajda.noMotivationJob?.setMotivation(valOrUpdater)

        this.motivation = Math.min(100, this.motivation)

        return this
    }

    setStopMotivation(val) {
        this.stopMotivation = val
        return this
    }

    setSet(val) {
        this.set = val
        return this
    }

    getDistances() {
        return this.distances
    }

    async loadMotivation() {
        await Ajax.get('job', 'job', {jobId: this.id, x: this.x, y: this.y}, (r) => {
            this.motivation = r.motivation * 100
        })

        return this.motivation
    }

    calculateDistanceToTarget(x, y) {
        return Map.calcWayTime({x: this.x, y: this.y}, {x, y})
    }

    /**
     * Calculate job distance to current character position
     */
    calculateDistance() {
        this.distance = Map.calcWayTime({x: this.x, y: this.y}, Character.position)
        return this.distance
    }

    /**
     * Calculate job distance to other selected jobs
     */
    calculateJobDistances() {
        this.distances = []
        for ( const job of Vajda.addedJobs ) {
            this.distances.push(Map.calcWayTime({x: this.x, y: this.y}, {x: job.x, y: job.y}))
        }
        return this.distances
    }

    loadPreferedEquip(equipObj) {
        if ( !equipObj ) return
        const set = equipObj[this.id]
        if ( set ) this.bestEquipment_ = set
    }
    
    savePreferedEquip() {
        const set = []
        for ( const slot of Wear.slots ) {
            if ( Wear.wear[slot]?.getId() ) {
                set.push(Wear.wear[slot]?.getId())
            }
        }

        VajdaStorageManager.savePreferedSet(this.id, set)
        new UserMessage('Best equip for this job has been saved.', UserMessage.TYPE_SUCCESS).show()
    }

    deletePreferedEquip() {
        const isDeleted = VajdaStorageManager.deletePreferedSet(this.id)
        isDeleted ? new UserMessage('Set deleted', UserMessage.TYPE_SUCCESS).show() : new UserMessage('There is nothing to delete', UserMessage.TYPE_HINT).show()
    }

    saveBestEquipment() {
        const skills = JobsModel.Jobs.find(j => j.id === this.id).get('skills')
        const set = west.item.Calculator.getBestSet(skills, this.id)
        const itemIds = set && set.getItems() || []
        this.bestEquipment_ = itemIds
        return itemIds
    }

    get bestEquipment() {
        return this.bestEquipment_ === undefined ? this.saveBestEquipment() : this.bestEquipment_
    }


    getBestEquipment() {
        if (!Bag.loaded) {
            EventHandler.listen('inventory_loaded', function() {
                this.getBestEquipment()
                return EventHandler.ONE_TIME_EVENT
            })
            return
        }
        
        const items = Bag.getItemsByItemIds(this.bestEquipment)
        const result = []

        for (const item of items) {
            const wearItem = Wear.get(item.getType())
            if (!wearItem || (wearItem && (wearItem.getItemBaseId() !== item.getItemBaseId() || wearItem.getItemLevel() < item.getItemLevel()))) {
                result.push(item)
            }
        }
        return result.map(item => item.obj.getId())
    }

    getNearestNonSilver() {
        if ( this.isSilver === false ) return this

        const nearest = Vajda.allJobs.filter(j => !Vajda.isJobSilver(j.x, j.y, j.id) && j.id === this.id).reduce((prev, curr) => {
            return prev.calculateDistanceToTarget(this.x, this.y) < curr.calculateDistanceToTarget(this.x, this.y) 
                ?  prev : curr
        })

        return nearest
    }

    getJobToWalkTo() {
        const jobGroup = JobList.getJobsByGroupId(this.groupId)

        const jobToWalkTo = jobGroup.map(j => 
            j.id
        ).map( id => {
            const j = JobsModel.getById(id)

            return {
                id: id,
                workpoints: j.workpoints,   //required LP
                jobpoints: j.jobpoints      //character has LP
            }
        }).reduce((prev, curr) => {
            return prev.workpoints < curr.workpoints ? prev : curr
        })

        return jobToWalkTo
    }
}

class MotivationJob extends Job {
    constructor(job) {
        super(job.x, job.y, job.id, job.groupId)
        this.motivation = 100
        this.spendMotivation_ = false
        this.stopMotivation = 0
        this.isSilver = false
        this.experience = job.experience
        this.money = job.money
        this.noPbEquipment = {}
        this.currentLevel = Character.level
        this.html = null
    }

    updateHTML() {
        const elem = this.html.find('#single-job-imported-sets')
        const levels = []
        let text = 'Imported sets for levels: '
        for ( const key in this.noPbEquipment ) {
            levels.push(key.replace('level_', ''))
        }
        elem.text(text.concat(levels.join(', ')))
    }

    getJobToWalkTo() {
        return this
    }

    getBestEquipment() {
        if ( this.currentLevel < Character.level ) {
            this.currentLevel = Character.level
        }

        if ( !this.noPbEquipment[`level_${this.currentLevel}`] ) return []

        const equip = this.noPbEquipment[`level_${this.currentLevel}`]
        const res = []
        for ( const slot of Wear.slots ) {
            if ( equip[slot] === undefined && Wear.wear[slot] !== undefined ) {
                Wear.uncarry(slot)
                continue
            }

            if ( equip[slot] === Wear.wear[slot]?.getId() ) {
                continue
            }

            res.push(equip[slot])
        }
        return res
    }

    deleteCurrentEquip(level) {
        delete this.noPbEquipment[`level_${level}`]
        new UserMessage(`Equip for level ${level} deleted`, UserMessage.TYPE_SUCCESS).show()
        this.updateHTML()
    }

    saveCurrentEquip(level) {
        const equip = {}

        for ( const slot of Wear.slots ) {
            equip[slot] = Wear.wear[slot]?.getId()
        }

        this.noPbEquipment[`level_${level}`] = equip
        this.updateHTML()
        new UserMessage(`Equip for level ${level} saved`, UserMessage.TYPE_SUCCESS).show()
    }

    exportEquip() {
        const blob = new Blob([JSON.stringify(this.noPbEquipment, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        const name = JobsModel.getById(this.id)?.jobObj.name.replace(' ', '_')
        link.download = `${name}.json`

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    importEquip(file) {
        const reader = new FileReader()

        reader.onload = e => {
            const fileContents = e.target.result
            const sets = JSON.parse(fileContents)

            this.noPbEquipment = sets
            this.updateHTML()
            new UserMessage('Equipment import successful', UserMessage.TYPE_SUCCESS).show()
        }
        
        reader.readAsText(file)
    }

    setMotivation(valOrUpdater) {
        if ( typeof valOrUpdater === 'function' ) {
            this.motivation = valOrUpdater(this.motivation)
        } else {
            this.motivation = valOrUpdater
        } 

        this.motivation = Math.min(100, this.motivation)

        return this
    }

    get spendMotivation() {
        return Vajda.addedJobs.length === 1 ? this.spendMotivation_ : false
    }

    set spendMotivation(valOrUpdater) {
        if ( typeof valOrUpdater === 'function' ) {
            this.spendMotivation_ = valOrUpdater(this.spendMotivation_)
        } else {
            this.spendMotivation_ = valOrUpdater
        }
    }
}

class JobPoolJob {
    constructor(id, set = -1, keep = false, priority = 0) {
        this.id = id
        this._set = set
        this.keepAnyway = keep
        this.priority = priority
    }

    get set() {
        if ( this._set === -1 ) {
            return Vajda.nightshiftWorker.defaultSet
        }

        return this._set
    }

    set set(val) {
        this._set = val
    }

    remove() {
        const pool = Vajda.nightshiftWorker.jobPool
        const index = pool.findIndex(j => j.id === this.id)
        pool.splice(index, 1)
    }
}

window.ActivityObserver = {
    activityCheckTimeout: null,
    refreshCount: 0,
    isEnabled: false,
    timeOut: 5 * 60 * 1000, //five minutes

    restartSession: function() {
        Vajda.finishAndReroute()
        if ( Vajda.currentState === 2 ) {
            this.start()
            return
        }

        VajdaStorageManager.saveObserverSession()
        VajdaStorageManager.saveChosenJobs()
        location.reload()
    },

    resumeSession: function() {
        if ( !VajdaStorageManager.loadObserverSession() ) return
        setTimeout(() => {
            this.start()
            Vajda.createWindow(false)
            Vajda.beginRun(false)
        }, 10000)
    },

    start: function(forceStart = false) {
        if ( !this.isEnabled && !forceStart ) return

        clearTimeout(this.activityCheckTimeout)
        this.activityCheckTimeout = setTimeout(this.restartSession.bind(this), this.timeOut)
    },

    stop: function() {
        this.isEnabled = false
        if ( this.activityCheckTimeout !== null )
            clearTimeout(this.activityCheckTimeout)
        this.activityCheckTimeout = null
    },

    getTimeOut: function(convertToMinutes) {
        if ( convertToMinutes ) {
            return this.timeOut / 1000 / 60
        }
        return this.timeOut
    },

    setIsEnabled: function(valOrUpdater) {
        if ( typeof valOrUpdater === 'function' ) {
            this.isEnabled = valOrUpdater(this.isEnabled)
        } else {
            this.isEnabled = valOrUpdater
        }
    },

    setTimeOut: function(val) {
        if ( Number.isNaN(val) ) 
            return
        
        this.timeOut = Math.max(Number(val) * 60 * 1000, 2.5 * 60 * 1000)
    },

    setRefreshCount: function(valOrUpdater) {
        if ( typeof valOrUpdater === 'function' ) {
            this.refreshCount = valOrUpdater(this.refreshCount)
        } else {
            this.refreshCount = valOrUpdater
        }
    }
}

window.ConsumablesManager = {
    consumables: [],
    buffs: [],
    isOptimized: false,
    jobsLeftInRound: 0,
    schedule: [],
    selectedBuffs: {
        travel: null,
        character: null
    },
    consumablesSelection: null,


    loadJobMotivation: async function(updatedJobsMotivation = undefined) {
        let expectedJobCount = 0
        const uniqueJobsCount = Vajda.addedJobs.length

        if ( updatedJobsMotivation !== undefined ) {
            expectedJobCount = updatedJobsMotivation.reduce((acc, curr) => acc + curr, 0)

            return { expectedJobCount, uniqueJobsCount }
        }

        for ( const job of Vajda.addedJobs ) {
            expectedJobCount += Math.max(await job.loadMotivation() - job.stopMotivation, 0)

            await sleep(500)
        }

        return { expectedJobCount, uniqueJobsCount }
    },

    createSchedule: async function(updatedJobsMotivation) {
        const bottlePlugs = this.consumables.find(c => c.id === 52871000)

        //in case the game runs in the background and the job to travel to is not canceled we gonna need extra energy point
        //this is unlikely to happen but the energy wont go to waste anyway so why the fuck not
        const { expectedJobCount, uniqueJobsCount } = await this.loadJobMotivation(updatedJobsMotivation)

        this.setJobsLeftInRound(expectedJobCount)

        const availableEnergy = Character.energy
        const energyToFill = expectedJobCount + uniqueJobsCount - availableEnergy
        const refillCount = Math.ceil(
            energyToFill / ( bottlePlugs.energy / 100 * Character.maxEnergy )
        )

        //use plugs when n jobs left in round
        const schedule = []

        for ( let i = 0; i < refillCount; i++ ) {
            //40 15s jobs in consumable cooldown
            schedule.push(40 + i*40)
        }

        this.schedule = schedule
    
        return schedule
    },

    checkSchedule: async function(jobCount) {
        const bottlePlug = this.consumables.find(c => c.id === 52871000)

        for ( let i = 0; i < jobCount; i++ ) {
            this.setJobsLeftInRound(p => p - 1)
            if ( this.isScheduledRefill(jobCount) ) {
                //the use of consumable blocks the start of new jobs for a short amount of time, so this sleep exists to prevent that
                await sleep(10000)
                this.useConsumableOrWaitForCooldown(bottlePlug)
                this.schedule.pop()
                this.setJobsLeftInRound(p => p - (jobCount - i - 1))
                return
            }
        }
    },

    isScheduledRefill: function(jobCount) {
        const isScheduled = this.isOptimized && this.getRefillsLeft() > 0 && this.jobsLeftInRound <= this.schedule.at(-1) && Vajda.currentState !== 2
        const isEnergyLow = this.isOptimized && this.getRefillsLeft() > 0 && Character.energy - jobCount <= 10
        return isScheduled || isEnergyLow
    },

    canUseConsumable: function(consumable) {
        if ( consumable instanceof Buff ) {
            return consumable.canUseAsBuff()
        }

        if ( BuffList.cooldowns[consumable.id] !== undefined && BuffList.cooldowns[consumable.id].time > Now().getTime() ) {
            return false
        }
        return true
    },

    findProperConsumable: function(motivationMissing, energyMissing, averageMotivationMissing) {
        const consumablesPool = this.getSelectedConsumables()
        const settings = Vajda.settings

        function betterEnergy(item1, item2) {
            let distanceItem1 = Math.abs(energyMissing - item1.energy)
            let distanceItem2 = Math.abs(energyMissing - item2.energy)
            return (distanceItem1 < distanceItem2 ) ? -1 : (distanceItem1 > distanceItem2) ? 1 : 0
        }
        function betterMotivation(item1, item2) {
            let distanceItem1 = Math.abs(averageMotivationMissing - item1.motivation)
            let distanceItem2 = Math.abs(averageMotivationMissing - item2.motivation)
            return (distanceItem2 < distanceItem1) ? item2 : item1
        }
        function findMotivationConsume(consumes) {
            let consumableToChoose = null
            for ( let i = 0; i < consumes.length; i++ ) {
                if ( consumableToChoose === null && consumes[i].motivation !== 0) {
                    consumableToChoose = consumes[i]
                    continue
                }
                
                if ( consumableToChoose !== null && consumes[i].motivation !== 0) {
                    consumableToChoose = betterMotivation(consumableToChoose, consumables[i])
                }
            }
            return consumableToChoose
        }
        function findHealthConsume(consumables) {
            for ( let i = 0; i < consumables.length; i++ ) {
                if ( consumables.at(i).health !== 0 ) {
                    return consumables[i]
                }
            }
            return null
        }

        if ( consumablesPool.length  === 0 ) return null

        const consumables = consumablesPool.sort(betterEnergy)
        
        if ( settings.addEnergy && energyMissing === 100 ) {
            return consumables[0]
        }

        if ( settings.addMotivation && motivationMissing === Vajda.addedJobs.length ) {
            return findMotivationConsume(consumables) 
        }

        if ( settings.addHealth && Vajda.isHealthBelowLimit() ) {
            if ( this.isOptimized ) {
                this.schedule.pop()
            }
            return findHealthConsume(consumables)
        }
    },

    useConsumable: async function(consumable) {
        const item = Bag.getItemByItemId(consumable.id)
        item.showCooldown()

        if ( Vajda.shouldEquipHealthSet(consumable) )
            await Vajda.equipSet(Vajda.healthSet)

        ItemUse.doIt(consumable.id)
        consumable.removeOne()     
        
        while(true) {
            if ( !this.canUseConsumable(consumable) ) {
                $('.tw2gui_dialog_framefix').remove()
                break
            }
            await sleep(100)
        }

        Vajda.currentState = 1
    },

    useConsumableOrWaitForCooldown: async function(consumableOrId, isSync = false) {
        const consumable = consumableOrId instanceof Consumable ? consumableOrId : this.getSelectedConsumables().find(c => c.id === consumableOrId)
        if ( consumable === undefined ) {
            return false
        }

        Vajda.currentState = 2

        while (true) {
            if ( consumable.hasCooldown() === false || this.canUseConsumable(consumable) ) {
                break
            }

            if ( !Vajda.isRunning ) {
                return
            }

            await sleep(1000)
        }
        Vajda.currentState = 5
        await this.useConsumable(consumable)
        
        isSync && Vajda.run()
    },

    isConsumableAdded: function(item) {
        if ( item === undefined )
            return true
        for ( const consumable of this.consumables ) {
            if ( consumable.id === item.obj.item_id ) {
                return true
            }
        }
        for ( const buff of this.buffs ) {
            if ( buff.id === item.obj.item_id ) {
                return true
            }
        }
        return false
    },

    useBuff: function(type) {
        const buff = this.getSelectedBuffs(type)

        if ( buff?.canUseAsBuff() && !Vajda.isWastingMotivation() ) {
            this.useConsumable(buff)
        }
    },

    parseConsumableBonuses: function(bonuses) {
        const { energyText, motivationText, healthText, speedText, luckText, dropText, experienceText, moneyText } = Vajda.searchKeys[Vajda.language]

        const result = {
            energy: 0,
            health: 0,
            motivation: 0,
            hasBuffs: false,
            buffs: {
                character: {
                    luck: 0,
                    money: 0,
                    experience: 0,
                    drop: 0
                },
                travel: 0
            }
        }

        function getValue(bonus, bonusText) {
            return Number(bonus.toLowerCase().replace(bonusText.toLowerCase(), '').replace(' ', '').replace('%', '').replace('+', ''))
        }
        
        for (const bonus of bonuses) {
            if ( bonus.includes(energyText) ) {
                result.energy = getValue(bonus, energyText)
                continue
            }
            
            if ( bonus.includes(motivationText) ) {
                result.motivation = getValue(bonus, motivationText)
                continue
            }

            if ( bonus.includes(healthText) ) { 
                result.health = getValue(bonus, healthText)
                continue
            }

            if ( bonus.includes(speedText) ) {
                result.buffs.travel = getValue(bonus, speedText)
                result.hasBuffs = true
                continue
            }

            if ( bonus.includes(luckText) ) {
                result.buffs.character.luck = getValue(bonus, luckText)
                result.hasBuffs = true
                continue
            }

            if ( bonus.includes(experienceText) ) {
                result.buffs.character.experience = getValue(bonus, experienceText)
                result.hasBuffs = true
                continue
            }

            if ( bonus.includes(moneyText) ) {
                result.buffs.character.money = getValue(bonus, moneyText)
                result.hasBuffs = true
                continue
            }

            if ( bonus.includes(dropText) ) {
                result.buffs.character.drop = getValue(bonus, dropText)
                result.hasBuffs = true
            }
        }

        return result
    },

    addNewConsumable: function(item) {
        if ( this.isConsumableAdded(item) ) {
            return
        }
        
        const { energy, motivation, health, hasBuffs, buffs } = this.parseConsumableBonuses(item.obj.usebonus)

        if ( health === 0 && motivation === 0 && energy === 0 && !hasBuffs )
            return

        if ( hasBuffs ) {
            const buff = new Buff(item.obj.item_id, item.obj.image, item.obj.name, buffs)
                .setEnergy(energy)
                .setMotivation(motivation)
                .setHealth(health)
                .setCount(item.count)
            
            return buff.hasCooldown() ? this.consumables.push(buff) : this.buffs.push(buff)
        }
        
        const consumable = new Consumable(item.obj.item_id, item.obj.image, item.obj.name)
            .setEnergy(energy)
            .setMotivation(motivation)
            .setHealth(health)
            .setCount(item.count)
        this.consumables.push(consumable)
    },

    hasEnoughPlugsAndDecorations: function() {
        const bottlePlugs = this.consumables.find(c => c.id === 52871000)
        const decorations = this.consumables.find(c => c.id === 53339000)

        if ( !bottlePlugs || !decorations ) {
            new UserMessage("No plugs or decorations were found, defaulting back to selected consumables", UserMessage.TYPE_HINT).show()
            this.isOptimized = false
            return false
        }
        return true
    },

    getSelectedConsumables: function() {
        if ( this.isOptimized ) {
            const bottlePlugs = this.consumables.find(c => c.id === 52871000)
            const decorations = this.consumables.find(c => c.id === 53339000)

            return [bottlePlugs, decorations]
        } else {
            return this.consumables.filter(c => c.isSelected === true)
        }
    },

    addSelectedConsumable: function(val) {
        if ( typeof val === 'number' )
            this.consumables.at(val).isSelected = true

        if ( val instanceof Consumable ) 
            this.consumables.find(c => c.id === val.id).isSelected = true
    },

    setIsOptimized: function(valOrUpdater) {
        if ( typeof valOrUpdater === 'function' ) {
            this.isOptimized = valOrUpdater(this.isOptimized)
        } else {
            this.isOptimized = valOrUpdater
        }
    },

    setJobsLeftInRound: function(valOrUpdater) {
        if ( typeof valOrUpdater === 'function' ) {
            this.jobsLeftInRound = valOrUpdater(this.jobsLeftInRound)
        } else {
            this.jobsLeftInRound = valOrUpdater
        }
    },

    getRefillsLeft: function() {
        return this.schedule.length
    },

    getSelectedBuffs: function(type) {
        switch(type) {
            case 'travel':
                return this.selectedBuffs.travel
            case 'character':
                return this.selectedBuffs.character
            case 'object':
                return this.selectedBuffs
            default:
                const res = []
                for ( const type in this.selectedBuffs ) {
                    this.selectedBuffs[type] && res.push(this.selectedBuffs[type])
                }

                return res
        }
    },

    setSelectedBuff: function(buff) {
        if ( !buff ) return
        const type = buff.getBuffType()
        if ( this.selectedBuffs[type]?.id === buff.id ) {
            this.selectedBuffs[type] = null
            return
        }

        this.selectedBuffs[type] = buff
        new UserMessage(`New ${type} buff selected`, UserMessage.TYPE_SUCCESS).show()
    },

    removeSelectedBuff: function(buffOrType) {
        if ( buffOrType instanceof Buff ) {
            this.selectedBuffs[buffOrType.getBuffType()] = null
        } else {
            this.selectedBuffs[buffOrType] = null
        }
        VajdaStorageManager.saveSelectedConsumables()
    }
}

window.VajdaStorageManager = {
    prefix: `${location.host}_Vajda`,

    loadStatistics: function() {
        const statistics = JSON.parse(localStorage.getItem(`${this.prefix}.statistics`))
        if ( statistics === null ) return null
        Vajda.statistics = statistics
        return statistics
    },

    saveStatistics: function() {
        localStorage.setItem(`${this.prefix}.statistics`, JSON.stringify(Vajda.statistics))
    },

    loadSettings: function() {
        const settings = JSON.parse(localStorage.getItem(`${this.prefix}.settings`))
        if ( settings === null ) return null
        Vajda.settings = {
            addDeposit: settings.addDeposit || {
                isEnabled: false,
                limit: NaN
            },
            addEnergy: settings.addEnergy || false,
            addHealth: settings.addHealth || false,
            addMotivation: settings.addMotivation || false,
            autostop: settings.autostop || {
                isEnabled: false,
                time: '3:00',
                date: null
            },
            minHP: settings.minHP || 1000,
            nanny: {
                isEnabled: settings.nanny?.isEnabled || false,
                stopTime: settings.nanny?.stopTime || '3:00',
                stopDate: null
            },
            randomDelay: settings.randomDelay || {
                isEnabled: false,
                maxDuration: 60,
                chance: 0
            },
            rememberSelection: settings.rememberSelection || {
                consumables: false,
                travelBuff: false,
                characterBuff: false
            },
            setWearDelay: settings.setWearDelay || 5
        }
        return settings
    },

    saveSettings: function() {
        localStorage.setItem(`${this.prefix}.settings`, JSON.stringify(Vajda.settings))
    },

    loadChosenJobs: function() {
        const obj = JSON.parse(localStorage.getItem(`${this.prefix}.chosen_jobs`))
        
        if ( obj === null ) return null

        if ( obj.expires_at <= Now().getTime() ) {
            localStorage.removeItem(`${this.prefix}.chosen_jobs`)
            return null
        }

        const addedJobs = []

        obj.jobs.forEach(j => {
            const job = new Job(j.x, j.y, j.id, j.groupId)
                .setSet(j.set)
                .setStopMotivation(j.stopMotivation)
                .setIsSilver(j.isSilver)
            addedJobs.push(job)
        })

        Vajda.addedJobs = addedJobs

        return addedJobs
    },

    saveChosenJobs: function() {
        const jobs = Vajda.addedJobs
        const expires_at = Now()
        const hours = expires_at.date.getHours()
        expires_at.date.setHours(3, 0, 0, 0)
        if ( hours >= 3 ) {
            expires_at.date.setDate(expires_at.date.getDate() + 1)
        }

        const obj = {
            jobs: jobs.map(j => ({
                id: j.id,
                x: j.x,
                y: j.y,
                groupId: j.groupId,
                set: j.set,
                stopMotivation: j.stopMotivation,
                isSilver: j.isSilver
            })),
            expires_at: expires_at.getTime()
        } 

        localStorage.setItem(`${this.prefix}.chosen_jobs`, JSON.stringify(obj))
    },

    loadPreferedSets: function() {
        return JSON.parse(localStorage.getItem(`${this.prefix}.prefered_sets`))
    },

    deletePreferedSet: function(jobId) {
        const obj = this.loadPreferedSets()
        if ( !obj || !obj[jobId] ) {
            return false
        }

        delete obj[jobId]

        if ( Object.keys(obj).length === 0 ) {
            localStorage.removeItem(`${this.prefix}.prefered_sets`)
            return true
        }

        localStorage.setItem(`${this.prefix}.prefered_sets`, JSON.stringify(obj))
        return true
    },

    savePreferedSet: function(jobId, set) {
        const obj = this.loadPreferedSets() || {}

        obj[jobId] = set

        localStorage.setItem(`${this.prefix}.prefered_sets`, JSON.stringify(obj))
    },

    loadSets: function() {
        const obj = JSON.parse(localStorage.getItem(`${this.prefix}.sets`))

        if ( obj === null ) return

        Vajda.travelSet = obj.travelSet
        Vajda.healthSet = obj.healthSet

        return obj
    },

    saveSets: function() {
        const obj = {
            travelSet: Vajda.travelSet,
            healthSet: Vajda.healthSet
        }

        localStorage.setItem(`${this.prefix}.sets`, JSON.stringify(obj))
    },

    loadJobPoolSettings: function() {
        const obj = JSON.parse(localStorage.getItem(`${this.prefix}.job_pool`))

        if ( obj === null ) return []

        const workerSettings = {
            ...obj,
            jobPool: obj.jobPool.map(j => new JobPoolJob(j.id, j.set, j.keepAnyway, j.priority))
        }

        Vajda.nightshiftWorker = workerSettings

        return workerSettings
    },

    saveJobPoolSettings: function() {
        const worker = Vajda.nightshiftWorker
        const jobs = worker.jobPool

        const obj = {
            ...worker,
            jobPool: jobs.map(j => ({
                id: j.id,
                set: j._set,
                priority: j.priority,
                keepAnyway: j.keepAnyway
            }))
        }

        localStorage.setItem(`${this.prefix}.job_pool`, JSON.stringify(obj))
    },

    loadObserverSettings: function() {
        const obj = JSON.parse(localStorage.getItem(`${this.prefix}.observer_settings`))

        if ( obj === null ) return null

        ActivityObserver.setIsEnabled(obj.isEnabled)
        ActivityObserver.setTimeOut(obj.timeOut)
        
        return obj
    },

    saveObserverSettings: function() {
        const obj = {
            isEnabled: ActivityObserver.isEnabled,
            timeOut: ActivityObserver.getTimeOut(convertToMinutes = true)
        }

        localStorage.setItem(`${this.prefix}.observer_settings`, JSON.stringify(obj))
    },

    deleteObserverSession: function() {
        localStorage.removeItem(`${this.prefix}.observer_session`)
    },

    loadObserverSession: function() {
        const obj = JSON.parse(localStorage.getItem(`${this.prefix}.observer_session`))

        if ( obj === null ) return false

        this.loadConsumables()

        const { timeOut, refreshCount, ...rest } = obj

        ActivityObserver.setRefreshCount(refreshCount)
        ActivityObserver.setIsEnabled(true)
        Vajda = {...Vajda, ...rest}

        this.deleteObserverSession()
        
        return true
    },

    saveObserverSession: function() {
        const settings = {
            statistics: Vajda.statistics,
            refreshCount: ActivityObserver.refreshCount + 1,
            travelSet: Vajda.travelSet,
            jobSet: Vajda.jobSet,
            healthSet: Vajda.healthSet
        }

        this.saveConsumables()
        localStorage.setItem(`${this.prefix}.observer_session`, JSON.stringify(settings))
    },

    loadManagerSettings: function() {
        const obj = JSON.parse(localStorage.getItem(`${this.prefix}.manager_settings`))

        if ( obj === null ) return null

        ConsumablesManager.isOptimized = obj.isOptimized

        return obj
    },

    saveManagerSettings: function() {
        const obj = {
            isOptimized: ConsumablesManager.isOptimized
        }

        localStorage.setItem(`${this.prefix}.manager_settings`, JSON.stringify(obj))
    },

    loadConsumables: function() {
        Bag.updateCooldowns()
        const obj = JSON.parse(localStorage.getItem(`${this.prefix}.consumables`))

        if ( obj === null ) return null

        const consumables = obj.consumables.map(c => new Consumable().import(c))
        const buffs = obj.buffs.map(b => new Buff().import(b))

        ConsumablesManager.consumables = consumables
        ConsumablesManager.buffs = buffs

        if ( obj.selectedBuffs.travel ) {
            ConsumablesManager.setSelectedBuff(buffs.find(b => b.id === obj.selectedBuffs.travel.id))
        }

        if ( obj.selectedBuffs.character ) {
            ConsumablesManager.setSelectedBuff(buffs.find(b => b.id === obj.selectedBuffs.character.id))
        }

        this.deleteConsumables()

        return obj
    },

    saveConsumables: function() {
        const obj = {
            selectedBuffs: ConsumablesManager.selectedBuffs,
            consumables: ConsumablesManager.consumables.map(c => c.export()),
            buffs: ConsumablesManager.buffs.map(b => b.export())
        }

        localStorage.setItem(`${this.prefix}.consumables`, JSON.stringify(obj))
    },

    deleteConsumables: function() {
        localStorage.removeItem(`${this.prefix}.consumables`)
    },

    loadSelectedConsumables: function() {
        const obj = JSON.parse(localStorage.getItem(`${this.prefix}.selected_consumables`))

        if ( obj === null ) return null

        ConsumablesManager.consumablesSelection = {
            travelBuff: obj.travel,
            characterBuff: obj.character,
            consumables: obj.consumables
        }

        return obj
    },

    saveSelectedConsumables: function() {
        const settings = Vajda.settings.rememberSelection
        const obj = {
            character: settings.characterBuff ? ConsumablesManager.getSelectedBuffs('character') : null,
            travel: settings.travelBuff ? ConsumablesManager.getSelectedBuffs('travel') : null,
            consumables: settings.consumables ? ConsumablesManager.consumables.filter(c => c.isSelected).map(c => c.id) : null
        }

        localStorage.setItem(`${this.prefix}.selected_consumables`, JSON.stringify(obj))
    },

    loadAllInit: function() {
        this.loadJobPoolSettings()
        this.loadSettings()
        this.loadSets()
        this.loadChosenJobs()
        this.loadObserverSettings()
        this.loadManagerSettings()
        this.loadSelectedConsumables()
        this.loadStatistics()
    }
}

window.Vajda = {
    addedJobs: [],
    allJobs: [],
    addedJobTablePosition: {
        content: "0px",
        scrollbar:"0px"
    },
    consumableSelection: {
        energy: false,
        motivation: false,
        health: false,
        hideBuffs: false
    },
    consumableTablePosition: {
        content: '0px',
        scrollbar: '0px'
    },
    consumableUsed: [],
    currentJob: {
        job: 0,
        direction: true
    },
    currentState: 0,
    healthSet: -1,
    language: "",
    isLoaded: false,
    isRunning: false,
    jobFilter: {
        filterOnlySilver: false,
        filterNoSilver: false,
        filterCenterJobs: false,
        filterJob: ""
    },
    jobSet: -1,
    jobsLoaded: false,
    jobTablePosition: {
        content: "0px",
        scrollbar: "0px"
    },
    nightshiftWorker: {
        isEnabled: false,
        jobPool: [],
        defaultSet: -1,
        limit: 17,
        swapTime: '3:00'
    },
    noMotivationJob: null,
    settings: {
        addDeposit: {
            isEnabled: false,
            limit: NaN
        },
        addEnergy: false,
        addHealth: false,
        addMotivation: false,
        autostop: {
            isEnabled: false,
            time: '3:00',
            date: null
        },
        delayedStart: null,
        minHP: 1000,
        nanny: {
            isEnabled: false,
            stopTime: '3:00',
            stopDate: null
        },
        randomDelay: {
            isEnabled: false,
            maxDuration: 60,
            chance: 0
        },
        rememberSelection: {
            consumables: false,
            travelBuff: false,
            characterBuff: false
        },
        setWearDelay: 5
    },
    states: [
        'Idle',
        'Running',
        'Waiting for a consumable cooldown',
        'Calculating optimal route',
        'Swapping silver jobs',
        'Consumable use failed'
    ],
    statistics: {
        sessionJobsCount: 0,
        sessionXpCount: 0,
        sessionMoneyCount: 0,
        totalJobsCount: 0,
        totalXpCount: 0,
        totalMoneyCount: 0
    },
    selectedSet: 0,
    sets: null,
    settings: {
        addDeposit: {
            isEnabled: false,
            limit: NaN
        },
        addEnergy: false,
        addHealth: false,
        addMotivation: false,
        autostop: {
            isEnabled: false,
            time: '3:00'
        },
        minHP: 1000,
        nanny: {
            isEnabled: false,
            stopTime: '3:00',
            stopDate: null
        },
        rememberSelection: {
            consumables: false,
            travelBuff: false,
            characterBuff: false
        },
        setWearDelay: 5
    },
    sortJobTableXp: 0,
    sortJobTableDistance: 0,
    travelSet: -1,
    regenerationSet: -1,
    window: null,
    searchKeys: {
        "en_DK":{
            energy:"Energy",
            energyText:"Energy increase:",
            motivation:"Work motivation",
            motivationText:"Work motivation increase:",
            health: "Health point bonus",
            healthText:"Health point bonus:"
        },
        "sk_SK": {
            energy:"Energie",
            energyText:"Zvýšenie energie:",
            motivation:"Pracovnej motivácie",
            motivationText:"Zvýšenie pracovnej motivácie:",
            health: "Bonus bodov zdravia",
            healthText:"Bonus bodov zdravia:",
            speedText: "Rýchlosť",
            experience: "skúseností",
            experienceText: "Skúseností z práce, duelov a boja o pevnosť",
            money: "peňazí",
            moneyText: "Peňazí z práce a duelov",
            luck: "šťastie",
            luckText: "Vylepšené šťastie",
            drop: "produktu",
            dropText: "Vylepšenie šance na získanie produktu"
        },
        "cs_CZ":{
            energy:"Energie",
            energyText:"Zvýšení energie:",
            motivation:"Pracovní motivace",
            motivationText:"Zvýšení pracovní motivace:",
            health: "Bonus zdraví",
            healthText:"Bonus zdraví:",
            speedText: "Rychlost",
            experience: "zkušeností",
            experienceText: "zkušeností z prací, duelů a bitev o pevnost",
            money: "prací",
            moneyText: "$ z prací a duelů",
            luck: "štěstí",
            luckText: "Vyšší šance na štěstí",
            drop: "produktu",
            dropText: "Vylepšené šance nálezu produktu"
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
        }
    },

    formatNumber: function(number) {
        if ( typeof number === 'number' ) {
            number = String(number)
        }

        const numberString = number.replace(/[ ,]/g, '')
    
        let formattedNumber = ''
        for ( let i = 0; i < numberString. length; i++ ) {
            if ( i > 0 && i % 3 === 0 ) {
                formattedNumber = ' ' + formattedNumber
            }

            formattedNumber = numberString[numberString.length - 1 - i] + formattedNumber
        }
        
        return formattedNumber
    },    

    isNumber: function(potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber))
    },

    RNG: function(min, max) {
        let minN = Math.min(min, max)
        let maxN = Math.max(min, max)

        let number =  Math.floor((minN + Math.random() * (maxN - minN + 1)))
        return number
    },

    isAllowedToDepositMoney: function() {
        const hasMoreMoneyThanLimit = this.settings.addDeposit.limit <= Character.money
        const hasHomeTown = Character.homeTown.town_id !== 0

        if ( hasHomeTown === false ) {
            return false
        }
        
        return this.settings.addDeposit.isEnabled && hasMoreMoneyThanLimit
    },

    updateStatistics: function(oldXp, oldMoney) {
        const xpDiff = Character.experience - oldXp
        const moneyDiff = Character.money - oldMoney
        
        this.statistics.sessionXpCount += xpDiff
        this.statistics.totalXpCount += xpDiff

        if ( moneyDiff > 0 ) {      //spending money while vajda is running would make this a bit funky
            this.statistics.sessionMoneyCount += moneyDiff
            this.statistics.totalMoneyCount += moneyDiff
        }
    },

    shouldEquipHealthSet: function(consumable) {
        if ( this.isHealthBelowLimit() ) {
            return true
        }

        if ( !consumable.hasCooldown() ) {
            return false
        }

        if ( ConsumablesManager.isOptimized ) {
            return false
        }

        return consumable.health > 0 && this.healthSet > -1
    },

    findAllConsumables: function() {
        if ( this.searchKeys[this.language] === undefined ) return
        const energyConsumables = Bag.search(this.searchKeys[this.language].energy)
        for ( const consumable of energyConsumables ) {
            ConsumablesManager.addNewConsumable(consumable)
        }

        const motivationConsumables = Bag.search(this.searchKeys[this.language].motivation)
        for ( const consumable of motivationConsumables ) {
            ConsumablesManager.addNewConsumable(consumable)
        }

        const healthConsumables = Bag.search(this.searchKeys[this.language].health)
        for ( const consumable of healthConsumables ) {
            ConsumablesManager.addNewConsumable(consumable)
        }

        const speedConsumables = Bag.search(this.searchKeys[this.language].speedText)
        for ( const consumable of speedConsumables ) {
            if ( consumable.obj.usetype !== 'none' ) {
                ConsumablesManager.addNewConsumable(consumable)
            }
        }

        const luckConsumables = Bag.search(this.searchKeys[this.language].luck)
        for ( const consumable of luckConsumables ) {
            if ( consumable.obj.usetype !== 'none' ) {
                ConsumablesManager.addNewConsumable(consumable)
            }
        }

        const experienceConsumables = Bag.search(this.searchKeys[this.language].experience)
        for ( const consumable of experienceConsumables ) {
            if ( consumable.obj.usetype !== 'none' ) {
                ConsumablesManager.addNewConsumable(consumable)
            }
        }

        const moneyConsumables = Bag.search(this.searchKeys[this.language].money)
        for ( const consumable of moneyConsumables ) {
            if ( consumable.obj.usetype !== 'none' ) {
                ConsumablesManager.addNewConsumable(consumable)
            }
        }

        const dropConsumables = Bag.search(this.searchKeys[this.language].drop)
        for ( const consumable of dropConsumables ) {
            if ( consumable.obj.usetype !== 'none' ) {
                ConsumablesManager.addNewConsumable(consumable)
            }
        }
        
        if ( ConsumablesManager.consumablesSelection?.travelBuff ) {
            ConsumablesManager.setSelectedBuff(ConsumablesManager.buffs.find(b => b.id === ConsumablesManager.consumablesSelection.travelBuff.id))
        }

        if ( ConsumablesManager.consumablesSelection?.characterBuff ) {
            ConsumablesManager.setSelectedBuff(ConsumablesManager.buffs.find(b => b.id === ConsumablesManager.consumablesSelection.characterBuff.id))
        }

        if ( ConsumablesManager.consumablesSelection?.consumables ) {
            ConsumablesManager.consumables.forEach(c => {
                if ( ConsumablesManager.consumablesSelection.consumables.some(con => con === c.id) ) {
                    c.setIsSelected(true)
                }
            })
        }

        ConsumablesManager.consumablesSelection = null
    },

    filterConsumables: function(energy, motivation, health, hideBuffs) {
        const result = hideBuffs ? [] : [...ConsumablesManager.buffs] 

        for ( const consumable of ConsumablesManager.consumables ) {
            if ( energy && consumable.energy === 0 ) {
                continue
            }

            if ( motivation && consumable.motivation === 0 ) {
                continue
            }

            if ( health && consumable.health === 0 ) {
                continue
            }
            result.push(consumable)
        }

        return result
    },

    changeConsumableSelection: function(id, isSelected) {
        ConsumablesManager.consumables.find(c => c.id === id)?.setIsSelected(isSelected)
    },

    changeSelectionAllConsumables: function(selected) {
        for ( const consumable of ConsumablesManager.consumables ) {
            consumable.setIsSelected(selected)
        }
    },

    loadSets: async function(callback) {
        Ajax.remoteCallMode('inventory', 'show_equip', {}, function(r) {
            Vajda.sets = r.data
            if ( callback !== undefined ) 
                callback()
        })
    },

    loadJobMotivation: function(index, callback) {
        const job = this.addedJobs.at(index)
        Ajax.get('job', 'job', {jobId: job.id, x: job.x, y: job.y}, function(r) {
            if ( callback !== undefined )
                callback(r.motivation*100)
        })
    },

    loadLanguage: function() {
        Ajax.remoteCall("settings", "settings", {}, function(resp) {
            Vajda.language = resp.lang.account.key
        })
    },

    loadJobs: function(isReset = false) {
        if ( !this.jobsLoaded ) {
            new UserMessage("Loading...", UserMessage.TYPE_HINT).show()
            Ajax.get('map', 'get_minimap', {}, r => this.handleLoadJobs(r, isReset))
        } else {
            Vajda.findAllConsumables()
            this.createWindow()
        }
    },

    loadJobData: function(callback) {
        Ajax.get('work','index', {}, (r) => {
            if( r.error ) {
                console.log(r.error)
                return
            }
            JobsModel.initJobs(r.jobs)
            callback()
        })
    },

    initSessionReload: function() {
        VajdaStorageManager.saveConsumables()
        location.reload()
    },

    initSilverJobsSwap: async function() {
        await sleep(20000)

        const isLoadSuccessful = VajdaStorageManager.loadConsumables()

        if ( !isLoadSuccessful ) return
        
        Inventory.open(null, null, {category: 'yield'})

        while (true) {
            if ( wman.isWindowCreated(Inventory.uid) ) {
                wman.closeAll()
                break
            }
            await sleep(2000)
        }

        this.loadJobs(true)
    },

    selectSilverJobs: function() {
        if ( this.nightshiftWorker.jobPool.length === 0 ) {
            new UserMessage('Empty Job Pool', UserMessage.TYPE_ERROR).show()
            return
        }
        const max = this.nightshiftWorker.limit
        this.addedJobs = []
        this.sortJobTableDistance = -1
        const jobs = this.getAllUniqueJobs()

        for ( const poolJob of this.nightshiftWorker.jobPool ) {
            if ( this.addedJobs.length >= max ) break

            const job = jobs.find(j => j.id === poolJob.id)

            if ( this.isJobSilver(job.x, job.y, job.id) ) {
                this.addJob(job.x, job.y, job.id, poolJob.set)
                continue
            }

            if ( poolJob.keepAnyway ) {
                this.addJob(job.x, job.y, job.id, poolJob.set)
            }
        }
        console.log('Silver jobs swap finished at ', Now().date)
        VajdaStorageManager.saveChosenJobs()
        this.beginRun(false)
    },

    handleLoadJobs: function(r, isReset) {
        let index = 0
        let currentLength = 0
        let maxLength = 299
        var tiles = []
        const jobs = []

        for ( let jobGroup in r.job_groups ) {
            const groupId = parseInt(jobGroup)
            let group = r.job_groups[jobGroup]
            let jobsGroup = JobList.getJobsByGroupId(groupId)

            for ( let tilecoord = 0; tilecoord < group.length; tilecoord++ ) {
                let xCoord = Math.floor(group[tilecoord][0]/Map.tileSize)
                let yCoord = Math.floor(group[tilecoord][1]/Map.tileSize)
                if ( currentLength == 0 ) {
                    tiles[index] = []
                }

                tiles[index].push([xCoord,yCoord])
                currentLength++

                if ( currentLength === maxLength ) {
                    currentLength = 0
                    index++
                }

                for ( let i = 0; i < jobsGroup.length; i++ ) {
                    const job = new Job(group[tilecoord][0],group[tilecoord][1],jobsGroup[i].id, groupId)
                    job.setIsSilver(Vajda.isJobSilver(job.x, job.y, job.id))
                    jobs.push(job)
                }
            }
        }
        let toLoad = tiles.length
        let loaded = 0
        for ( let blocks = 0; blocks < tiles.length; blocks++ ) {
            Map.Data.Loader.load(tiles[blocks], () => {
                loaded++
                if ( loaded === toLoad ) {
                    Vajda.jobsLoaded = true
                    Vajda.allJobs = jobs
                        
                    if ( isReset ) {
                        Vajda.loadJobData(Vajda.selectSilverJobs.bind(Vajda))
                    } else {
                        Vajda.findAllConsumables()
                        Vajda.createWindow()
                    }
                    
                }
            })
        }
    },

    getJobSet: function(x, y, id) {
        const job = this.findAddedJob(x, y, id)
        if ( job !== null )
            return job.set
    },

    setJobSet: function(x,y,id,set) {
        const job = this.findAddedJob(x, y, id)
        if ( job !== null)
            return job.setSet(set)
    },

    setPreferedJobSets: function() {
        const sets = VajdaStorageManager.loadPreferedSets()
        for ( const job of this.addedJobs ) {
            job.loadPreferedEquip(sets)
        }
    },

    findAddedJob: function(x, y, id) {
        for ( const job of this.addedJobs ) {
            if ( job.x === x && job.y === y && job.id === id ) {
                return job
            }
        }
        return null
    },

    getDateFromTimestring: function(timestring) {
        if ( !timestring ) return null
        const date = Now()
        const [hours, minutes] = timestring.split(':').map(t => Number(t))
        if ( date.date.getHours() >= hours ) {
            date.date.setDate(date.date.getDate() + 1)
        }

        date.date.setHours(hours, minutes, 0, 0)
        return date
    },

    checkJobSwapSchedule: async function() {
        if ( !this.nightshiftWorker?.isEnabled ) return Promise.resolve(false)

        if ( Now().getTime() < this.swapTime.getTime() ) {
            return Promise.resolve(false)
        }

        this.currentState = 4
        this.finishRun(false)
        await sleep(30000)
        this.initSessionReload()
        return Promise.resolve(true)
    },

    beginRun: async function(isHumanAction = true) {
        this.swapTime = this.getDateFromTimestring(this.nightshiftWorker.swapTime)
        this.settings.nanny.stopDate = this.getDateFromTimestring(this.settings.nanny.stopTime)
        this.settings.autostop.date = this.getDateFromTimestring(this.settings.autostop.time)
        const parseSuccesful = isHumanAction ? this.parseStopMotivation() : true
        if ( parseSuccesful ) {
            this.currentState = 3
            $(`#vajda-state-info`).text(`Current state: ${this.states[3]}`)
            this.createRoute()
            this.isRunning = true
            if ( ConsumablesManager.isOptimized && ConsumablesManager.hasEnoughPlugsAndDecorations() ) {
                await ConsumablesManager.createSchedule()
            }
            this.setPreferedJobSets()
            ActivityObserver.start()
            this.run()
        } else {
            new UserMessage("Wrong format of set stop motivation", UserMessage.TYPE_ERROR).show()
        }
    },

    finishRun: function(isRequiredAlert = true) {
        this.currentState = 0
        this.isRunning = false
        this.selectTab("chosenJobs")
        if ( isRequiredAlert ) {
            alert("Finished")
        }
    },

    autoFinish: function() {
        const time = this.settings.autostop.date?.getTime()
        const isEnabled = this.settings.autostop.isEnabled

        if ( isEnabled && time && time < Now().getTime() ) {
            this.finishRun()
        }
    },

    finishAndReroute: function() {
        const time = this.settings.nanny.stopDate?.getTime()
        const isEnabled = this.settings.nanny.isEnabled
        if ( isEnabled && time && time < Now().getTime() ) {
            location.replace('https://www.google.com/')
        }
    },

    updateJobDistances: function() {
        for ( const job of this.allJobs ) {
            job.calculateDistance()
        }
    },

    consolidePosition: function(removeIndex) {
        if ( removeIndex <= this.currentJob.job && this.currentJob.job > 0 ) {
            this.currentJob.job--
        }
        if ( this.addedJobs.length === 1 ) {
            this.currentJob.direction = true
        }
    },

    createDistanceMatrix: function() {
        const matrix = new Array(this.addedJobs.length)

        for ( let i = 0; i < matrix.length; i++ ) {
            matrix[i] = this.addedJobs[i].calculateJobDistances()
        }

        return matrix
    },

    countSetBits: function(n) {
        let count = 0
        while (n) {
            n &= n - 1
            count++
        }
        return count
    },

    heldKarpSymmetric: function(distances, startJob) {
        const n = distances.length
        const memo = Array(1 << n).fill().map(() => Array(n).fill({ cost: Infinity, path: [] }))
        memo[1 << startJob][startJob] = { cost: 0, path: [startJob] }
    
        for ( let subsetSize = 2; subsetSize <= n; subsetSize++ ) {
            for ( let subset = 0; subset < (1 << n); subset++ ) {
                if ( this.countSetBits(subset) === subsetSize && (subset & (1 << startJob)) ) {
                    for ( let end = 0; end < n; end++ ) {
                        if ( (subset & (1 << end)) !== 0 ) {
                            for ( let prevEnd = 0; prevEnd < n; prevEnd++ ) {
                                if ( prevEnd !== end && (subset & (1 << prevEnd)) !== 0 ) {
                                    const newCost = memo[subset ^ (1 << end)][prevEnd].cost + distances[prevEnd][end]
                                    if (newCost < memo[subset][end].cost) {
                                        memo[subset][end] = { cost: newCost, path: memo[subset ^ (1 << end)][prevEnd].path.concat([end]) }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    
        let minCost = Infinity
        let minPath = []
        for ( let end = 0; end < n; end++ ) {
            if ( end !== startJob && memo[(1 << n) - 1][end].cost < minCost ) {
                minCost = memo[(1 << n) - 1][end].cost
                minPath = memo[(1 << n) - 1][end].path
            }
        }

        return { cost: minCost, path: minPath }
    },

    setEntryPoint: function(route) {
        const firstJob = route.at(0)
        const lastJob = route.at(-1)

        if ( firstJob.calculateDistance() > lastJob.calculateDistance() )
            route.reverse()

        //i could in theory make vajda start with the job nearest to current character position but cba
    },

    getOptimalRoute: function(distanceMatrix) {
        const jobsCount = distanceMatrix.length

        if ( jobsCount === 1 ) 
            return {
                cost: 0,
                path: [0]
            }

        const routes = []
        for ( let startJob = 0; startJob < jobsCount; startJob++ ) {
            const { cost, path } = this.heldKarpSymmetric(distanceMatrix, startJob)
            routes.push({ cost, path })
        }

        return routes.reduce(function(prev, curr) {
            return prev.cost < curr.cost ? prev : curr
        })
    },

    createRoute: function() {
        this.currentJob = {
            job: 0,
            direction: true
        }

        const distanceMatrix = this.createDistanceMatrix()
        const optimalRoute = this.getOptimalRoute(distanceMatrix)

        const addedJobsOrder = []
        for ( const index of optimalRoute.path ) {
            addedJobsOrder.push(this.addedJobs.at(index))
        }

        this.setEntryPoint(addedJobsOrder)

        this.addedJobs = addedJobsOrder
        this.selectTab("chosenJobs")
        VajdaStorageManager.saveChosenJobs()
    },

    changeJob: function() {
        this.currentJob.direction ? this.currentJob.job++ : this.currentJob.job--;
        if ( this.currentJob.job === this.addedJobs.length ) {
            this.currentJob.job--
            this.currentJob.direction = false
        } else if ( this.currentJob.job < 0 ) {
            this.currentJob.job++
            this.currentJob.direction = true
        }
        this.run()
    },

    cancelJobs: function() {
        if ( TaskQueue.queue.length > 0 )
            TaskQueue.cancelAll()
    },

    run: async function() {
        const doSwap = await this.checkJobSwapSchedule()
        this.finishAndReroute()

        if ( !!doSwap ) {
            return
        }

        this.checkMotivation(0, [], async (result) => {
            if ( ( this.isMotivationAbove(result) || this.isStopMotivationZero()) && Character.energy > 0 && !this.isHealthBelowLimit() ) {
                this.currentState = 1
                this.prepareJobRun(this.currentJob.job)
            } else {
                if ( !this.canAddMissing(result) ) {
                    this.finishRun()
                } else {
                    const answer = await this.fillUp(result)
                    if ( !answer ) {
                        this.finishRun()
                    }
                }
            }
        })
    },   

    runJob: async function(jobIndex, jobCount) {
        this.statistics.sessionJobsCount += jobCount
        this.statistics.totalJobsCount += jobCount
        const oldXp = Character.experience
        const oldMoney = Character.money
        const job = this.isWastingMotivation() ? this.noMotivationJob : this.addedJobs.at(jobIndex)
        await this.equipBestGear(job)
        ActivityObserver.start()
        if ( TaskQueue.busy && TaskQueue.toAdd.length > 1) {
            TaskQueue.busy = false
            TaskQueue.toAdd = []
        }
        for ( let i = 0; i < jobCount; i++ ) {
            JobWindow.startJob(job.id, job.x, job.y, 15)
        }
        await sleep(this.settings.setWearDelay * 1000)
        this.equipSet(job.set)
        ConsumablesManager.useBuff('character')
        while (true) {
            if ( TaskQueue.queue.length === 0 ) {
                this.updateStatistics(oldXp, oldMoney)
                VajdaStorageManager.saveStatistics()
                this.prepareJobRun(jobIndex)
                return
            }
            if ( !this.isRunning || this.isHealthBelowLimit() ) {
                break
            }
            await sleep(1000)
        }
        this.statistics.sessionJobsCount -= TaskQueue.queue.length
        this.statistics.totalJobsCount -= TaskQueue.queue.length
        this.updateStatistics(oldXp, oldMoney)
        VajdaStorageManager.saveStatistics()
        await sleep(2000)
        this.cancelJobs()

        if ( this.isRunning && this.isHealthBelowLimit() ) {
            await sleep(2000)
            this.run()
        }
    },

    isInHomeTown: function() {
        const homeTown = Character.homeTown
        return Map.calcWayTime(Character.position,{x: homeTown.x, y: homeTown.y}) == 0
    },

    addDeposit: async function(townId) {
        const amount = Character.money
        await Ajax.remoteCall("building_bank", "deposit", {
            town_id: townId,
            amount: amount
        }, function(data) {
            if (data.error == false) {
                BankWindow.Balance.Mupdate(data)
                Character.setDeposit(data.deposit)
                Character.setMoney(data.own_money)
            } else
                new UserMessage(data.msg,UserMessage.TYPE_ERROR).show()
        }, BankWindow)
    },

    goDepositMoney: async function() {
        const townId = Character.homeTown.town_id
        if ( !townId ) return

        await this.equipSet(this.travelSet)
        TaskQueue.add(new TaskWalk(townId, 'town'))

        while(true) {
            if ( this.isInHomeTown() ) {
                break
            }

            if( !this.isRunning ) {
                break
            }

            await sleep(1000)
        }

        await this.addDeposit(townId)
        $('.tw2gui_dialog_framefix').remove()
    },

    walkToJob: async function(index) {
        const job = this.isWastingMotivation() ? this.noMotivationJob : this.addedJobs.at(index)
        const jobToWalkTo = job.getJobToWalkTo()

        await ConsumablesManager.useBuff('travel')

        if ( this.isAllowedToDepositMoney() ) {
            ActivityObserver.start()
            await this.goDepositMoney()
        }

        JobWindow.startJob(jobToWalkTo.id, job.x, job.y, 15)
        ActivityObserver.start()

        while (true) {
            if ( Map.calcWayTime(Character.position, {x: job.x, y: job.y} ) === 0 ) {
                break
            }

            if ( !this.isRunning ) {
                break
            }
            await sleep(1000)
        }
        this.cancelJobs()
        this.noMotivationJob?.spendMotivation && await sleep(4000)
        if ( this.isRunning ) 
            this.prepareJobRun(index)
    },

    prepareJobRun: function(index) {
        const job = this.isWastingMotivation() ? this.noMotivationJob :  this.addedJobs.at(index)
        this.loadJobMotivation(index, async (motivation) => {
            this.addedJobs.at(index).setMotivation(motivation)
            if ( Character.energy === 0 || this.isHealthBelowLimit() ) {
                this.run()
            }   else if ( motivation <= job.stopMotivation && job.stopMotivation > 0 ) {
                this.checkMotivation(0, [], result => {
                    if ( this.isMotivationAbove(result) ) {
                        this.changeJob()
                    } else {
                        this.run()
                    }
                })
            } else if ( Map.calcWayTime(Character.position,{x: job.x, y: job.y}) === 0 ) {
                let maxJobs = Premium.hasBonus('automation') ? 9 : 4
                let numberOfJobs
                if (job.stopMotivation !== 0 ) {
                    numberOfJobs = Math.min(Math.min(motivation - job.stopMotivation, Character.energy), maxJobs)
                } else {
                    numberOfJobs = Math.min(Character.energy, maxJobs)
                }

                this.runJob(index, Math.floor(numberOfJobs))
                if ( ConsumablesManager.isOptimized )
                    ConsumablesManager.checkSchedule(numberOfJobs)
            } else {
                await this.equipSet(this.travelSet)
                this.walkToJob(index)
            }
        })
    },
    
    findJobData: function(job) {
        for ( let i = 0 ;i < JobsModel.Jobs.length; i++ ) {
            if ( JobsModel.Jobs[i].id === job.id ) {
                return JobsModel.Jobs[i]
            }
        }
    },

    findJob: function(x, y, id, set = -1) {
        const job = this.allJobs.find(j => j.id === id && j.x === x && j.y === y)
        job?.setSet(set)
        return job
    },

    addJob: function(x, y, id, set) {
        let job = null
        if ( !this.checkIfJobAdded(id) ) {
            job = this.findJob(x, y, id, set)
            if ( job )
                this.addedJobs.push(job)
        }

        if ( this.addedJobs.length > 1 ) {
            this.noMotivationJob = null
        }

        return job
    },

    removeJob: function(x, y, id) {
        for ( let i = 0; i < this.addedJobs.length; i++ ) {
            if ( this.addedJobs[i].id === id && this.addedJobs[i].x === x && this.addedJobs[i].y === y) {
                this.addedJobs.splice(i,1)
                this.consolidePosition(i)
                break
            }
        }

        if ( this.addedJobs.length === 0 ) {
            this.noMotivationJob = null
        }
    },

    canAddMissing: function(result) {
        if ( !this.settings.addMotivation && this.jobsBelowMotivation(result) && !this.isStopMotivationZero() ) {
            alert("Can't continue because of motivation")
            return false
        }

        if ( !this.settings.addEnergy && Character.energy === 0 ) {
            alert("Can't continue because of energy")
            return false
        }

        if ( !this.settings.addHealth && this.isHealthBelowLimit() ) {
            alert("Can't continue because of health")
            return false
        }
        return true
    },

    checkMotivation: async function(index, result, callback) {
        let check = (index, result) => {
            this.loadJobMotivation(index, (motivation) => {
                this.addedJobs.at(index).setMotivation(motivation)
                result.push(motivation)
                if ( index + 1 < this.addedJobs.length ) {
                    check(++index, result)
                } else if( index + 1 === this.addedJobs.length ) {
                    callback(result)
                    return
                }
            })
        }
        check(index, result)
    },

    isMotivationAbove: function(result) {
        for ( let i = 0; i < result.length; i++ ) {
            if ( result.at(i) > this.addedJobs.at(i).stopMotivation ) {
                return true
            }
        }
        return false
    },

    isStopMotivationZero: function() {
        for ( let i = 0; i < this.addedJobs.length; i++ ) {
            if( this.addedJobs[i].stopMotivation === 0 ) {
                return true
            }
        }
        return false
    },

    isHealthBelowLimit: function() {
        if ( this.settings.minHP >= Character.health ) {
            return true
        }
        return false
    },

    isWastingMotivation: function() {
        if ( this.noMotivationJob?.motivation === 0 ) {
            this.noMotivationJob = null
        }

        return this.noMotivationJob?.spendMotivation
    },


    jobsBelowMotivation: function(result) {
        let count = 0
        for ( let i = 0; i < result.length; i++ ) {
            if ( result[i] <= this.addedJobs.at(i).stopMotivation && this.addedJobs.at(i).stopMotivation !== 0 ) {
                count++
            }
        }
        return count
    },   
 
    averageMissingMotivation: function(result) {
        let motivation = 0
        for ( let i = 0; i < result.length; i++ ) {
            motivation += 100-result[i]
        }
        return motivation/result.length
    },

    fillUp: async function(result) {
        const energyMissing = 100 - (Character.energy/Character.maxEnergy) * 100
        const motivationMissing = this.jobsBelowMotivation(result)
        const averageMotivationMissing = this.averageMissingMotivation(result)

        const consumableToUse = ConsumablesManager.findProperConsumable(motivationMissing, energyMissing, averageMotivationMissing)
        
        if ( consumableToUse === null ) return false

        await ConsumablesManager.useConsumableOrWaitForCooldown(consumableToUse, true)

        if ( ConsumablesManager.isOptimized && consumableToUse.isCakeDecoration() ) {
            const updatedMotivation = this.updateJobsMotivationOnRefill(consumableToUse.motivation)
            await ConsumablesManager.createSchedule(updatedMotivation)
        }

        return true
    },

    updateJobsMotivationOnRefill: function(val) {
        return this.addedJobs.map(job => job.setMotivation(p => p + val).motivation - job.stopMotivation)
    },

    setSetForAllJobs: function() {
        for ( const job of this.addedJobs ) {
            job.setSet(this.jobSet)
        }
    },

    parseJobData: function(jobs) {
        for ( let job = 0; job < jobs.length; job++ ) {
            let currentJob = jobs[job]
            let data = this.findJobData(currentJob)
            let xp = data.basis.short.experience
            let money = data.basis.short.money
            currentJob.setMotivation(data.jobmotivation*100)
            if ( currentJob.isSilver ) {
                xp = Math.ceil(1.5*xp)
                money = Math.ceil(1.5*money)
            }
            currentJob.setExperience(xp)
            currentJob.setMoney(money)
        }
    },

    getJobName: function(id) {
        return JobList.getJobById(id).name
    },

    checkIfJobAdded: function(id) {
        for ( const job of this.addedJobs ) {
            if ( job.id === id ) {
                return true
            }
        }

        return false
    },

    isJobSilver: function(x, y, id) {
        const key = `${x}-${y}`
        const jobData = Map.JobHandler.Featured[key]
        if ( jobData === undefined || jobData[id] === undefined ) {
            return false
        } else {
            return jobData[id].silver
        }
    },

    compareUniqueJobs: function(job, jobs){
        for ( let i = 0 ; i < jobs.length; i++ ) {
            if ( jobs[i].id === job.id ) {
                if ( job.isSilver && !jobs[i].isSilver || (job.isSilver === jobs[i].isSilver && job.distance < jobs[i].distance) ) {
                    const j = jobs.at(i)
                    if ( !this.isJobSilver(j.x, j.y, j.id) )
                        jobs.splice(i,1)
                    jobs.push(job)
                }
                return
            }
        }
        jobs.push(job)
    },

    getAllUniqueJobs: function() {
        this.updateJobDistances()
        let jobs = []
        for ( let i = 0 ; i < this.allJobs.length; i++ ) {
            const currentJob = this.allJobs.at(i)
            if ( this.jobFilter.filterJob !== "" ) {
                if ( !this.getJobName(currentJob.id).toLowerCase().includes(this.jobFilter.filterJob)) {
                    continue
                }
            }

            if ( this.checkIfJobAdded(currentJob.id) ) {
                continue
            }
            
            let isSilver = this.isJobSilver(currentJob.x, currentJob.y, currentJob.id)
            currentJob.isSilver = isSilver
            currentJob.calculateDistance()
            
            if ( isSilver && this.jobFilter.filterNoSilver ) {
                continue
            }

            if ( !isSilver && this.jobFilter.filterOnlySilver ) {
                continue
            }

            if ( this.jobFilter.filterCenterJobs && currentJob.id < 131 ) {
                continue
            }

            this.compareUniqueJobs(currentJob, jobs)
        }

        this.parseJobData(jobs)

        let experienceSort = function(a, b) {
            if ( a === null && b === null ) {
                return 0
            }

            if ( a === null && b !== null ) {
                return 1
            }

            if ( a !== null && b === null ) {
                return -1
            }

            let a1 = a.experience
            let b1 = b.experience
            return (a1 > b1) ? -1 :(a1 < b1) ? 1 :0
        }

        let reverseExperienceSort = function(a, b) {
            if ( a === null && b === null ) {
                    return 0
            }
            if ( a === null && b !== null ) {
                return -1
            }

            if ( a !== null && b === null ) {
                return 1
            }

            let a1 = a.experience
            let b1 = b.experience
            return (a1 > b1) ? 1 :(a1 < b1) ? -1 :0
        }

        let distanceSort = function(a, b) {
            if ( a === null && b === null ) {
                return 0
            }

            if ( a === null && b !== null ) {
                return 1
            }

            if ( a !== null && b === null ) {
                return -1
            }

            let a1 = a.distance
            let b1 = b.distance
            return (a1 > b1) ? -1 :(a1 < b1) ? 1 :0
        }

        let reverseDistanceSort = function(a, b) {
            if ( a === null && b === null ) {
                return 0
            }

            if ( a === null && b !== null ) {
                return -1
            }

            if(a !== null && b === null ) {
                return 1
            }

            let a1 = a.distance
            let b1 = b.distance
            return (a1 > b1) ? 1 :(a1 < b1) ? -1 :0
        }

        if ( this.sortJobTableXp === 1 ) {
            jobs.sort(experienceSort)
        }

        if ( this.sortJobTableXp === -1 ) {
            jobs.sort(reverseExperienceSort)
        }

        if ( this.sortJobTableDistance === 1 ) {
            jobs.sort(distanceSort)
        }

        if ( this.sortJobTableDistance === -1 ) {
            jobs.sort(reverseDistanceSort)
        }

        return jobs
    },

    parseStopMotivation: function() {
        for ( const job of this.addedJobs ) {
            if ( 0 <= job.stopMotivation <= 100 ) {
                continue
            }

            return false
        }

        return true
    },

    //maybe zbytocne jak bradavky na chlapovi
    searchBest: function(skills, jobId, onlyWearable = true) {
        if (!Bag.loaded) {
            EventHandler.listen('inventory_loaded', function() {
                Vajda.searchBest(skills, jobId, onlyWearable)
                return EventHandler.ONE_TIME_EVENT
            })
            return
        }
        let set = west.item.Calculator.getBestSet(skills, jobId), items = set && set.getItems() || [], invItems = Bag.getItemsByItemIds(items), result = [], i, invItem, wearItem
        for (i = 0; i < invItems.length; i++) {
            invItem = invItems[i]
            wearItem = Wear.get(invItem.getType())
            if (!wearItem || (wearItem && (wearItem.getItemBaseId() !== invItem.getItemBaseId() || wearItem.getItemLevel() < invItem.getItemLevel()))) {
                result.push(invItem)
            }
        }
        return result.map(item => item.obj.getId())
    },

    getBestGear: function(jobid) {
        let modelId = function(jobid) {
            for ( let i = 0; i < JobsModel.Jobs.length; i++ ) {
                if ( JobsModel.Jobs[i].id === jobid )
                    return i
            }
            return -1
        }
        const result = west.item.Calculator.getBestSet(JobsModel.Jobs[modelId(jobid)].get('skills'), jobid)
        const bestItems = result && result.getItems()
        return bestItems
    },

    isWearing: function(itemId) {
        if ( Wear.wear[ItemManager.get(itemId).type] === undefined) return false
        return Wear.wear[ItemManager.get(itemId).type].obj.item_id == itemId
    },

    isGearEquiped: function(items) {
        for ( const itemId of items ) {
            if ( !this.isWearing(itemId) ) {
                return false
            }
        }

        return true
    },

    equipBestGear: async function(job) {
        const bestGear = job.getBestEquipment()

        for ( const itemId of bestGear ) {
            Wear.carry(Bag.getItemByItemId(itemId))
        }

        setTimeout(() => {
            if ( !this.isGearEquiped(bestGear) && !this.isGearEquiped(this.getSetItemArray(this.sets[job.set])) ) {
                this.equipBestGear(job)
            }
        }, 10000)

        while (true) {
            const isFinished = this.isGearEquiped(bestGear)
            if ( isFinished ) break
            await sleep(50)
        }
        return Promise.resolve(true)
    },

    getSetItemArray: function(set) {
        var items = []
        if ( set.head !== null )
            items.push(set.head)
        if ( set.neck !== null )
            items.push(set.neck)
        if ( set.body !== null )
            items.push(set.body)
        if ( set.right_arm !== null ) 
            items.push(set.right_arm)
        if ( set.left_arm !== null )
            items.push(set.left_arm)
        if ( set.belt !== null )
            items.push(set.belt)
        if ( set.foot !== null )
            items.push(set.foot)
        if ( set.animal !== null ) 
            items.push(set.animal)
        if ( set.yield !== null ) 
            items.push(set.yield)
        if ( set.pants !== null ) 
            items.push(set.pants)
        return items
    },

    equipSet: async function(set) {
        if ( set === -1 ) return true
        EquipManager.switchEquip(this.sets[set].equip_manager_id)
        while ( true ) {
            let isFinished = this.isGearEquiped(this.getSetItemArray(this.sets[set]))
            if ( isFinished ) break
            await sleep(50)
        }
        return Promise.resolve(true)
    },

    resetTab: function(tabId) {
        switch(tabId) {
            case 'jobs':
                this.nightshiftWorker = {
                    isEnabled: false,
                    jobPool: [],
                    defaultSet: -1
                }
                this.selectTab('jobs')
                break
            case 'chosenJobs':
                this.addedJobs.forEach(j => j.setSet(-1))
                this.selectTab('chosenJobs')
                break
            case 'jobPool':
                this.nightshiftWorker = {
                    isEnabled: false,
                    jobPool: [],
                    defaultSet: -1
                }
                this.selectTab('jobPool')
                break
            case 'sets':
                this.healthSet = -1
                this.jobSet = -1
                this.speedSet = -1
                this.selectedSet = -1
                this.loadSets()
                this.selectTab('sets')
                break
            case 'settings':
                this.nightshiftWorker = {
                    isEnabled: false,
                    jobPool: [],
                    defaultSet: -1,
                    swapTime: '3:00',
                    limit: 17
                }
                this.settings = {
                    addEnergy: false,
                    addMotivation: false,
                    addHealth: false,
                    minHP: 1000,
                    setWearDelay: 5,
                    jobDelayMin: 0,
                    jobDelayMax: 0,
                    addDeposit: {
                        isEnabled: false,
                        limit: NaN
                    },
                    rememberSelection: {
                        consumables: false,
                        travelBuff: false,
                        characterBuff: false
                    }
                }
                this.selectTab('settings')
        }
    }, 

    getConsumableIcon: function(src) {
        return `<div><img src='${src}' alt=''></div>`
    },

    getItemImage: function(id) {
        return ItemManager.get(id).wear_image
    },

    createComboxJobSets: function(x, y, id) {
        const combobox = new west.gui.Combobox()
        this.addComboboxItems(combobox)
        combobox.select(this.getJobSet(x, y, id))
        combobox.setWidth(60)
        combobox.addListener((value) => {
            this.setJobSet(x, y, id, value)
            VajdaStorageManager.saveChosenJobs()
        })
        return combobox.getMainDiv()
    },

    addComboboxItems: function(combobox, defaultLabel = 'None') {
        combobox.addItem(-1, defaultLabel)
        for ( let i = 0 ; i < this.sets.length; i++) {
            combobox.addItem(i, this.sets[i].name)
        }
    },

    createAddJobButton: function(x, y, id) {
        const buttonAdd = new west.gui.Button("Add new job", () => {
            this.addJob(x, y, id)
            this.jobTablePosition.content = $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css("top")
            this.jobTablePosition.scrollbar = $(".vajda-window .tw2gui_scrollbar_pulley").css("top")
            this.selectTab("jobs")
            VajdaStorageManager.saveChosenJobs()
        })
        buttonAdd.setWidth(100)
        return buttonAdd.getMainDiv()
    },

    createTextfield: function(value, callback, width) {
        const textfield = new west.gui.Textfield()
        textfield.setValue(value)
        textfield.getMainDiv().find('input').change(callback)

        if ( width ) {
            textfield.setWidth(width)
        }

        return textfield.getMainDiv()
    },

    createCheckbox: function(label, isSelected, callback) {
        const checkbox = new west.gui.Checkbox()
        checkbox.setLabel(label)
        checkbox.setSelected(isSelected)
        checkbox.setCallback(callback)
        return checkbox.getMainDiv()
    },

    getJobFromJobPool: function(jobId) {
        return this.nightshiftWorker?.jobPool.find(j => j.id === jobId)
    },

    createErrorTab: function(tabId) {
        const resetButton = new west.gui.Button('Fix Errors', () => Vajda.resetTab(tabId))
        resetButton.getMainDiv().style.justifySelf = 'center'

        const style = `'
            position: absolute; 
            inset: 0; 
            display: grid; 
            align-content: center; 
            justify-content: center; 
            gap: 1rem; 
            padding-bottom: 5rem
        '`

        const html = $(`
            <div style=${style}>
                <h1 style='text-align: center'>OOOPS</h1>
                <p>Seems like something's gone to shieeet. Check your settings and make sure everything's alright.</p>
            </div>
        `)

        html.append(resetButton.getMainDiv())

        return html
    },

    createAddToJobsPoolButton: function(jobId) {
        if ( this.getJobFromJobPool(jobId) ) {
            return $(`<div style='width: 125px'></div>`)
        }

        const addToPool = () => {
            this.nightshiftWorker.jobPool.push(new JobPoolJob(jobId))
            Vajda.jobTablePosition.content = $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css("top")
            Vajda.jobTablePosition.scrollbar = $(".vajda-window .tw2gui_scrollbar_pulley").css("top")
            Vajda.selectTab("jobs")
            VajdaStorageManager.saveJobPoolSettings()
        }
        const button = new west.gui.Button("Add To Job Pool", addToPool)
        button.getMainDiv().style.marginBottom = '2px'
        return button.getMainDiv()
    },

    createSaveEquipButton: function(job) {
        const icon = $(`
            <div style='color: black; padding-left: 10px'>
                <svg style='cursor: pointer; width: 30px; transition: opacity .3s' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"/></svg>
            </div>
        `)
        icon.click(() => {
            job.savePreferedEquip()
        })

        icon.hover(function() {
                $(this).css('opacity', '.8')
            }, 
            function() {
                $(this).css('opacity', '1')
            }
        )
        return icon
    },

    createDeleteEquipButton: function(job) {
        const icon = $(`
            <div style='color: black; padding-left: 10px'>
                <svg style='cursor: pointer; width: 30px; height: 28px; transition: opacity .3s' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
            </div>
        `)

        icon.click(() => {
            job.deletePreferedEquip()
        })

        icon.hover(function() {
                $(this).css('opacity', '.8')
            }, 
            function() {
                $(this).css('opacity', '1')
            }
        )
        return icon
    },

    getJobIcon: function(isSilver, id, x, y) {
        return `
            <div class="job" style="left: 0; top: 0; position: relative;">
                <div onclick="JobWindow.open(${id}, ${x}, ${y})" class="featured ${isSilver && 'silver'}"></div>
                <div class='centermap' onclick='Map.center(${x}, ${y})' style="position: absolute; background-image: url('../images/map/icons/instantwork.png'); width: 20px; height: 20px; top: 0; right: 3px; cursor: pointer"></div>
                <img src="../images/jobs/${JobList.getJobById(id).shortname}.png" class="job_icon" alt='job_image'>
            </div>
        `
    },

    getJobPoolJobIcon: function(job) {
        let isOpen = false
        const html = $(`
            <div style='display: inline-grid; grid-template-columns: 1fr 0; overflow: hidden; padding: 5px; max-height: 84px'>
                <div class='job' style='padding: 10px; position: relative'>
                    <img src='../images/jobs/${JobList.getJobById(job.id).shortname}.png' class='job_icon' alt='job_image'> 
                    <svg class='bin-icon' style='position: absolute; top: 5px; right: 5px; width: 15px; transition: opacity .2s' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" fill='rgb(210, 0, 0)'/></svg>
                    <svg class='gear-icon' style='position: absolute; bottom: 5px; right: 5px; width: 15px; transition: opacity .2s' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                </div>
                <div class='options' style='min-width: 100px; overflow: hidden; display: grid; grid-template-areas: "a b" "c d"; padding: .5rem 1rem; background-color: rgba(255, 255, 228, .3); border-radius: 5px; box-shadow: 0 0 5px rgba(0, 0, 0, .2); margin-left: 8px'>
                    <div class='set' style='grid-area: a'>
                        Set for this job: 
                    </div>
                    <div style='grid-area: b; align-self: center; padding: 0 1rem'>
                        Job priority:
                    </div>
                    <div class='keep-job' style='grid-area: c'></div>
                    <div class='priority' style='grid-area: d; padding-left: 1rem'></div>
                </div>
            </div>
        `)
        const setsCombobox = new west.gui.Combobox()
        this.addComboboxItems(setsCombobox, 'Default')
        const selectedSet = this.nightshiftWorker.jobPool.find(j => j.id === job.id)._set
        setsCombobox.select(selectedSet)
        setsCombobox.setWidth(60)
        setsCombobox.addListener(val => {
            this.nightshiftWorker.jobPool.find(j => j.id === job.id).set = val
            VajdaStorageManager.saveJobPoolSettings()
        })

        const prioInput = $(`
            <input type='number' value='${job.priority}' placeholer='priority' style='max-width: 50px; padding: 2px 0 2px .5rem; border-radius: 3px; border: none; background-color: rgba(255, 255, 255, .6)'>
        `)
        prioInput.change(e => {
            this.nightshiftWorker.jobPool.find(j => j.id === job.id).priority = e.target.valueAsNumber
            const jobs = this.nightshiftWorker.jobPool
            const sorted = jobs.sort((a, b) => b.priority - a.priority)
            this.nightshiftWorker.jobPool = sorted
            VajdaStorageManager.saveJobPoolSettings()
        })

        html.find(`.bin-icon`).click( () => {
            const index = this.nightshiftWorker.jobPool.findIndex(j => j.id === job.id)
            this.nightshiftWorker.jobPool.splice(index, 1)
            this.selectTab(`jobPool`)
            VajdaStorageManager.saveJobPoolSettings()
        })

        html.find('.bin-icon').hover(function() {
                $(this).css('opacity', '.5')
            }, 
            function() {
                $(this).css('opacity', '1')
            }
        )

        html.find('.gear-icon').hover(function() {
                $(this).css('opacity', '.7')
            },
            function() {
                $(this).css('opacity', '1')
            }
        )

        html.find('.gear-icon').click(() => {
            isOpen = !isOpen
            html.css('grid-template-columns', isOpen ? '1fr auto' : '1fr 0')
        })

        html.find(`.options .set`).append(setsCombobox.getMainDiv())
        html.find(`.options .priority`).append(prioInput)
        html.find('.options .keep-job').append(this.createCheckbox('Keep job even if not silver', this.nightshiftWorker.jobPool.find(j => j.id === job.id).keepAnyway, val => {
            this.nightshiftWorker.jobPool.find(j => j.id === job.id).keepAnyway = val
            VajdaStorageManager.saveJobPoolSettings()
        }))
        return html
    },

    getImageSkel: function() {
        return $("<img src=\''\>")
    },

    insertSetImages: function(html,keys) {
        for ( let i = 0; i < keys.length; i++ ) {
            if ( this.sets[this.selectedSet][keys[i]] !== null ) {
                $(".wear_"+keys[i], html).append(this.getImageSkel().attr("src", this.getItemImage(this.sets[this.selectedSet][keys[i]])))
            }
        }
        return html
    },

    createRemoveJobButton: function(x, y, id) {
        const buttonRemove = new west.gui.Button("Remove job", () => {
            this.removeJob(x, y, id)
            this.addedJobTablePosition.content = $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css("top")
            this.addedJobTablePosition.scrollbar = $(".vajda-window .tw2gui_scrollbar_pulley").css("top")
            this.selectTab("chosenJobs")
            VajdaStorageManager.saveChosenJobs()
        })
        buttonRemove.setWidth(100)
        return buttonRemove.getMainDiv()
    },

    selectTab: function(key) {
        this.window?.tabIds[key].f(this.window,key)
    },

    removeActiveTab: function(window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active')
    },

    addActiveTab: function(key, window) {
        $(`div._tab_id_${key}`, window.divMain).addClass('tw2gui_window_tab_active')
    },
    
    removeWindowContent: function() {
        $(".vajda-window").remove()
    },

    addEventsHeader: function() {
        $(".vajda-window .jobXp").click( () => {
            if ( this.sortJobTableXp === 0 ) {
                this.sortJobTableXp = 1
            } else {
                ( this.sortJobTableXp === 1 ) ? this.sortJobTableXp = -1 : this.sortJobTableXp = 1
            }
            this.sortJobTableDistance = 0
            this.selectTab("jobs")
        })
        $(".vajda-window .jobDistance").click( () => {
            if ( this.sortJobTableDistance === 0 ) {
                this.sortJobTableDistance = 1
            } else {
                ( this.sortJobTableDistance === 1 ) ? this.sortJobTableDistance = -1 : this.sortJobTableDistance = 1
            }
            this.sortJobTableXp = 0
            this.selectTab("jobs")
        })
    },

    createJobsTab: function() {
        if ( !this.nightshiftWorker ) throw new Error()
        const htmlSkel = $(`<div id='jobs_overview'></div>`)
        const html = $(`
            <div class='jobs_search' style='position: relative'>
                <div id='jobFilter' style='position: absolute; top: 10px; left: 15px'></div>
                <div id='job_only_silver' style='position: absolute; top:10px; left: 200px;'></div>
                <div id='job_no_silver' style='position: absolute; top: 10px; left: 270px;'></div>
                <div id='job_center' style='position: absolute; top: 10px; left: 350px;'></div>
                <div id='button_filter_jobs' style='position: absolute; top: 5px; left: 450px;'></div>
            </div>
        `)
        
        const table = new west.gui.Table()
        const arrow_desc = '&nbsp;<img src="../images/window/jobs/sortarrow_desc.png"/>'
        const arrow_asc = '&nbsp;<img src="../images/window/jobs/sortarrow_asc.png"/>'
        const uniqueJobs = this.getAllUniqueJobs()
        table
            .addColumn("jobIcon", "jobIcon")
            .addColumn("jobName", "jobName")
            .addColumn("jobDistance", "jobDistance")
            .addColumn("jobAdd", "jobAdd")
            .addColumn("poolAdd", "poolAdd")
            .addColumn("saveEquip", "saveEquip")
            .addColumn("deleteEquip", "deleteEquip")
        table
            .appendToCell("head", "jobIcon", "Job icon")
            .appendToCell("head", "jobName", "Job name")
            .appendToCell("head", "jobDistance", "Distance " + (this.sortJobTableDistance == 1 ? arrow_asc : this.sortJobTableDistance == -1 ? arrow_desc : ""))
            .appendToCell("head", "jobAdd", "")
            .appendToCell("head", "poolAdd", "")
            .appendToCell("head", "saveEquip", "")
            .appendToCell("head", "deleteEquip", "")

        for ( const job of uniqueJobs ) {
            table
                .appendRow()
                .appendToCell(-1, "jobIcon", this.getJobIcon(job.isSilver, job.id, job.x, job.y))
                .appendToCell(-1, "jobName", this.getJobName(job.id))
                .appendToCell(-1, "jobDistance", job.distance.formatDuration())
                .appendToCell(-1, "jobAdd", this.createAddJobButton(job.x, job.y, job.id))
                .appendToCell(-1, "poolAdd", this.createAddToJobsPoolButton(job.id))
                .appendToCell(-1, "saveEquip", this.createSaveEquipButton(job))
                .appendToCell(-1, "deleteEquip", this.createDeleteEquipButton(job))
        }
        const textfield = new west.gui.Textfield("jobsearch").setPlaceholder("Select job name")
        if ( this.jobFilter.filterJob !== "" ) {
            textfield.setValue(this.jobFilter.filterJob)
        }

        const checkboxOnlySilver = new west.gui.Checkbox()
        checkboxOnlySilver.setLabel("Silvers")
        checkboxOnlySilver.setSelected(this.jobFilter.filterOnlySilver)
        checkboxOnlySilver.setCallback(val => {
            this.jobFilter.filterOnlySilver = val
        })
        const checkboxNoSilver = new west.gui.Checkbox()
        checkboxNoSilver.setLabel("No silvers")
        checkboxNoSilver.setSelected(this.jobFilter.filterNoSilver)
        checkboxNoSilver.setCallback(val => {
            this.jobFilter.filterNoSilver = val
        })
        const checkboxCenterJobs = new west.gui.Checkbox()
        checkboxCenterJobs.setLabel("Center jobs")
        checkboxCenterJobs.setSelected(this.jobFilter.filterCenterJobs)
        checkboxCenterJobs.setCallback(val => {
            this.jobFilter.filterCenterJobs = val
        })
        const buttonFilter = new west.gui.Button("Filter", () => {
            this.jobFilter.filterJob = textfield.getValue()
            this.jobTablePosition.content = "0px"
            this.jobTablePosition.scrollbar = "0px"
            this.selectTab("jobs")
        })
        htmlSkel.append(table.getMainDiv())
        $('#jobFilter', html).append(textfield.getMainDiv())
        $("#job_only_silver",html).append(checkboxOnlySilver.getMainDiv())
        $("#job_no_silver",html).append(checkboxNoSilver.getMainDiv())
        $("#job_center",html).append(checkboxCenterJobs.getMainDiv())
        $("#button_filter_jobs",html).append(buttonFilter.getMainDiv())
        htmlSkel.append(html)
        return htmlSkel
    },

    createAddedJobsTab: function() {
        const htmlSkel = $(`<div id='added_jobs_overview'></div>`)
        const footerHtml = $(`
            <div id='start_vajda' style='position: relative'>
                <span id='vajda-state-info' class='vajda_state' style='position: absolute; left: 20px; top: 10px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: bold;'> 
                    Current state: ${this.states[this.currentState]}
                </span>
                <div class='vajda_run' style='position: absolute; right: 15px; top: 20px'></div>
            </div>
        `)
        const table = new west.gui.Table()
        table
            .addColumn("jobIcon","jobIcon")
            .addColumn("jobName","jobName")
            .addColumn("jobStopMotivation","jobStopMotivation")
            .addColumn("jobSet","jobSet")
            .addColumn("jobRemove","jobRemove")
        
        table
            .appendToCell("head","jobIcon","Job icon")
            .appendToCell("head","jobName","Job name")
            .appendToCell("head","jobStopMotivation","Stop motivation")
            .appendToCell("head","jobSet","Job set")
            .appendToCell("head","jobRemove","")
        
        
        for ( const job of this.addedJobs ) {
            table.appendRow()
                .appendToCell(-1,"jobIcon", this.getJobIcon(job.isSilver, job.id, job.x, job.y))
                .appendToCell(-1,"jobName", this.getJobName(job.id))
                .appendToCell(-1,"jobSet", this.createComboxJobSets(job.x, job.y, job.id))
                .appendToCell(-1,"jobRemove", this.createRemoveJobButton(job.x, job.y, job.id))
                .appendToCell(-1,"jobStopMotivation", this.createTextfield(job.stopMotivation, e => {
                    const val = e.target.value
                    if ( !this.isNumber(val) || val > 99 || val < 0 )  {
                        new UserMessage(`A number between 0 and 99 is expected`, UserMessage.TYPE_ERROR).show()
                        return
                    }
                    job.setStopMotivation(Number(val))
                    VajdaStorageManager.saveChosenJobs()
                }, 40))
        }
        const buttonStart = new west.gui.Button("Start", this.beginRun.bind(this))
        const buttonStop = new west.gui.Button("Stop", () => {
            this.isRunning = false
            this.currentState = 0
            this.selectTab("chosenJobs")
            ActivityObserver.stop()
        })
        const selectAndStart = new west.gui.Button('Select And Start', this.selectSilverJobs.bind(this))
        htmlSkel.append(table.getMainDiv())
        if ( this.addedJobs.length === 1 ) {
            htmlSkel.append(this.createSingleJobMenu())
        }
        $('.vajda_run', footerHtml).append(selectAndStart.getMainDiv())
        $(".vajda_run", footerHtml).append(buttonStart.getMainDiv())
        $(".vajda_run", footerHtml).append(buttonStop.getMainDiv())
        htmlSkel.append(footerHtml)
        return htmlSkel
    },

    createSingleJobMenu: function() {
        let currentLevel = 1
        const motivationSpendCheckbox = this.createCheckbox('Enable Farming Assistant', this.noMotivationJob !== null && this.noMotivationJob.spendMotivation, val => {
            if ( this.noMotivationJob === null && this.addedJobs.length === 1 ) {
                const job = this.addedJobs.at(0)
                this.noMotivationJob = new MotivationJob(job.getNearestNonSilver())  
                this.noMotivationJob.html = html  
            } 

            if ( this.noMotivationJob ) this.noMotivationJob.spendMotivation = val

            if ( this.noMotivationJob?.spendMotivation ) {
                html.find('#animation').css('grid-template-rows', '1fr')
            } else {
                html.find('#animation').css('grid-template-rows', '0fr')
            }
        })


        const levelsCombobox = new west.gui.Combobox()
        for ( let i = 1; i < 10; i++ ) {
            levelsCombobox.addItem(i.toString(), `Level ${i}`)
        }

        levelsCombobox.select(1)
        levelsCombobox.addListener(v => {
            currentLevel = v
        })

        const saveButton = new west.gui.Button('Save current clothes', () => {
            thisVajda.noMotivationJob?.saveCurrentEquip(currentLevel)
        })

        const deleteButton = new west.gui.Button('Delete clothes', () => {
            this.noMotivationJob?.deleteCurrentEquip(currentLevel)
        })

        const input = $(`<input type='file' style='display: none' accept='json'>`)
        input.change(e => {
            const file = e.target.files[0]

            if ( file ) {
                this.noMotivationJob?.importEquip(file)
            }
        })

        const importSettings = new west.gui.Button('Import', () => input.click())
        const exportSettings = new west.gui.Button('Export', () => this.noMotivationJob.exportEquip())


        const isOpen = this.noMotivationJob !== null && this.noMotivationJob.spendMotivation
        const html = $(`
            <div style='position: absolute; top: 110px; width: calc(100% - 4rem); padding: 0 2rem'>
                <div id='single-job-settings'></div>

                <div id='animation' style='display: grid; grid-template-rows: ${isOpen ? '1fr' : '0fr'}; overflow: hidden; transition: grid-template-rows .4s'>
                    <span style='overflow: hidden'>
                        <div id='single-job-clothes-settings' style='display: flex; justify-content: space-around; padding: 1rem 0'></div>
                        <div id='single-job-options' style='display: flex; justify-content: space-around; padding: 1rem 0'></div>
                        <div id='single-job-imported-sets'></div>    
                    </span>
                </div>
            </div>
        `)

        html.append(input)
        html.find('#single-job-settings').append(motivationSpendCheckbox) 
        html.find('#single-job-clothes-settings').append(levelsCombobox.getMainDiv())
        html.find('#single-job-clothes-settings').append(saveButton.getMainDiv())
        html.find('#single-job-clothes-settings').append(deleteButton.getMainDiv())
        html.find('#single-job-options').append(importSettings.getMainDiv()) 
        html.find('#single-job-options').append(exportSettings.getMainDiv()) 

        return html
    },

    createSetGui: function() {
        if ( this.sets.length === 0 ) {
            return $(`<span style='font-size: 20px'>No sets available</span>`)
        }
        const htmlSkel = $(`
            <div id='vajda_sets_window' style='display: block; position: relative; width: 650px; height:430px'>
                <div id='vajda_sets_left' style='display: block; position: absolute; width: 250px; height: 430px; top:0px; left:0px'></div>
                <div id='vajda_sets_right' style='display: block; position: absolute; width:300px; height: 410px; top: 0px; left: 325px'></div>
            </div>`)
        const combobox = new west.gui.Combobox("combobox_sets")
        this.addComboboxItems(combobox)
        combobox.select(Vajda.selectedSet)
        combobox.addListener(val => {
            this.selectedSet = val
            this.selectTab("sets")
        })
        const buttonSelectTravelSet = new west.gui.Button("Select travel set", () => {
            this.travelSet = this.selectedSet
            this.selectTab("sets")
            VajdaStorageManager.saveSets()
        })
        const buttonSelectJobSet = new west.gui.Button("Select job set", () => {
            this.jobSet = this.selectedSet
            this.setSetForAllJobs()
            this.selectTab("sets")
            VajdaStorageManager.saveChosenJobs()
        })
        const buttonSelectHealthSet = new west.gui.Button("Select health set", () => {
            this.healthSet = this.selectedSet
            this.selectTab("sets")
            VajdaStorageManager.saveSets()
        })

        let travelSetText = "None"

        if ( this.travelSet != -1 ) {
            travelSetText = this.sets[this.travelSet].name
        }

        let jobSetText = "None"
        if ( this.jobSet != -1 ) {
            jobSetText = this.sets[this.jobSet].name
        }

        let healthSetText = "None"
        if ( this.healthSet != -1 ) {
            healthSetText = this.sets[this.healthSet].name
        }

        const left = $("<div></div>")
            .append(
                new west.gui.Groupframe()
                .appendToContentPane($("<span>Sets</span><br><br>"))
                .appendToContentPane(combobox.getMainDiv())
                .appendToContentPane($("<br><br><span>Travel set:"+ travelSetText +"</span><br><br>"))
                .appendToContentPane(buttonSelectTravelSet.getMainDiv())
                .appendToContentPane($("<br><br><span>Job set:"+ jobSetText +"</span><br><br>"))
                .appendToContentPane(buttonSelectJobSet.getMainDiv())
                .appendToContentPane($("<br><br><span>Health set:"+ healthSetText +"</span><br><br>"))
                .appendToContentPane(buttonSelectHealthSet.getMainDiv())
                .getMainDiv()
            )
         const right = $("<div style=\'display:block; position:relative; width:300px; height:410px'\></div>")
        //head div
        right.append("<div class=\'wear_head wear_slot'\ style=\'display:block; position:absolute; left:30px; top:1px; width:93px; height:94px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position: -95px 0'\></div>")
        //chest div
        right.append("<div class=\'wear_body wear_slot'\ style=\'display:block; position:absolute; left:30px; top:106px; width:95px; height:138px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:0 0'\></div>")
        //pants div
        right.append("<div class=\'wear_pants wear_slot'\ style=\'display:block; position:absolute; left:30px; top:258px; width:93px; height:138px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:0 0'\></div>")
        //neck div
        right.append("<div class=\'wear_neck wear_slot'\ style=\'display:block; position:absolute; left:-47px; top:1px; width:74px; height:74px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-189px 0'\></div>")
        //right arm div
        right.append("<div class=\'wear_right_arm wear_slot'\ style=\'display:block; position:absolute; left:-64px; top:79px; width:95px; height:138px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:0 0'\></div>")
        //animal div
        right.append("<div class=\'wear_animal wear_slot'\ style=\'display:block; position:absolute; left:-64px; top:223px; width:93px; height:94px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-95px 0'\></div>")
        //yield div
        right.append("<div class=\'wear_yield wear_slot'\ style=\'display:block; position:absolute; left:-47px; top:321px; width:74px; height:74px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-189px 0'\></div>")
        //left arm div
        right.append("<div class=\'wear_left_arm wear_slot'\ style=\'display:block; position:absolute; left:127px; top:52px; width:95px; height:138px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:0 0'\></div>")
        //belt div
        right.append("<div class=\'wear_belt wear_slot'\ style=\'display:block; position:absolute; left:127px; top:200px; width:93px; height:94px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-95px 0'\></div>")
        //boots div
        right.append("<div class=\'wear_foot wear_slot'\ style=\'display:block; position:absolute; left:127px; top:302px; width:93px; height:94px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-95px 0'\></div>")
        let keys = ["head","body","pants","neck","right_arm","animal","yield","left_arm","belt","foot"]
        if ( this.selectedSet !== -1 )
            this.insertSetImages(right,keys)
        $("#vajda_sets_left",htmlSkel).append(left)
        $("#vajda_sets_right",htmlSkel).append(right)
        return htmlSkel
    },

    createJobsPoolGui: function() {
        const html = $(`
            <div style='height: 400px; overflow-y: auto'>
                <div id='set-selection' style='padding-bottom: 1rem; display: flex; align-items: center; justify-content: center; gap: 1rem'>
                    <strong>Select default set for these jobs: </strong>
                </div>

                <div id='pool'></div>
            </div>`
        )

        const setsCombobox = new west.gui.Combobox()
        this.addComboboxItems(setsCombobox)
        setsCombobox.setWidth(60)
        setsCombobox.select(this.nightshiftWorker.defaultSet)
        setsCombobox.addListener(val => {
            this.nightshiftWorker.defaultSet = val
            VajdaStorageManager.saveJobPoolSettings()
        })
        
        html.find('#set-selection').append(setsCombobox.getMainDiv())
        const pool = html.find('#pool')
        this.nightshiftWorker.jobPool.forEach((j, i) => pool.append(this.getJobPoolJobIcon(j, i)))
        
        return html
    },

    createConsumablesTable: function() {
        const htmlSkel = $(`<div id='consumables_overview'></div>`)
        const html = $(`
            <div class ='consumables_filter' style='position: relative'>
                <div id='energy_consumables' style='position: absolute; top: 10px; left: 15px'></div> 
                <div id='motivation_consumables' style='position: absolute; top: 10px; left: 160px'></div> 
                <div id='health_consumables' style='position: absolute; top: 10px; left: 320px'></div> 
                <div id='buff_consumables' style='position: absolute; top: 10px; left: 460px'></div>
            </div>`
        )

        const table = new west.gui.Table()
        const consumableList = this.filterConsumables(this.consumableSelection.energy, this.consumableSelection.motivation, this.consumableSelection.health, this.consumableSelection.hideBuffs)
        table
            .addColumn("consumIcon","consumIcon")
            .addColumn("consumCount","consumCount")
            .addColumn("consumEnergy","consumEnergy")
            .addColumn("consumMotivation","consumMotivation")
            .addColumn("consumHealth","consumHealth")
            .addColumn("consumBuffs", "consumBuffs")
            .addColumn("consumSelected","consumSelected")

        table
            .appendToCell("head","consumIcon","Image")
            .appendToCell("head","consumCount","Count")
            .appendToCell("head","consumEnergy","Energy")
            .appendToCell("head","consumMotivation","Motivation")
            .appendToCell("head","consumHealth","Health")
            .appendToCell("head", "consumBuffs", "Buffs")
            .appendToCell("head","consumSelected","Use")
        
        for ( const consumable of consumableList ) {
            const checkbox = this.createCheckbox(null, consumable.isSelected, val => {
                this.consumableTablePosition.content = $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css("top")
                this.consumableTablePosition.scrollbar = $(".vajda-window .tw2gui_scrollbar_pulley").css("top")
                if ( consumable instanceof Buff && !consumable.hasCooldown() ) {
                    ConsumablesManager.setSelectedBuff(consumable)
                    this.selectTab('consumables')
                    VajdaStorageManager.saveSelectedConsumables()
                    return
                } else {
                    consumable.setIsSelected(val)
                }
                this.selectTab("consumables")
                VajdaStorageManager.saveSelectedConsumables()
            })
            table.appendRow()
                .appendToCell(-1,"consumIcon", Vajda.getConsumableIcon(consumable.image))
                .appendToCell(-1,"consumCount",consumable.count)
                .appendToCell(-1,"consumEnergy",consumable.energy)
                .appendToCell(-1,"consumMotivation",consumable.motivation)
                .appendToCell(-1,"consumHealth",consumable.health)
                .appendToCell(-1, "consumBuffs", consumable.getBuffHTML())
                .appendToCell(-1,"consumSelected",checkbox)
        }
        const buttonSelect = new west.gui.Button("Select all", () => {
            this.changeSelectionAllConsumables(true)
            this.selectTab("consumables")
            VajdaStorageManager.saveSelectedConsumables()
        })
        const buttonDeselect = new west.gui.Button("Deselect all", () => {
            this.changeSelectionAllConsumables(false)
            this.selectTab("consumables")
            VajdaStorageManager.saveSelectedConsumables()
        })
        table.appendToFooter("consumEnergy",buttonSelect.getMainDiv())
        table.appendToFooter("consumHealth",buttonDeselect.getMainDiv())
        htmlSkel.append(table.getMainDiv())
        const checkboxEnergyConsumes = this.createCheckbox('Energy Consumables', this.consumableSelection.energy, val => {
            this.consumableSelection.energy = val
            this.selectTab("consumables")
        })
        
        const checkboxMotivationConsumes = this.createCheckbox('Motivation Consumables', this.consumableSelection.motivation, val => {
            this.consumableSelection.motivation = val
            this.selectTab("consumables")
        })

        const checkboxHealthConsumes = this.createCheckbox('Health Consumables', this.consumableSelection.health, val => {
            this.consumableSelection.health = val
            this.selectTab("consumables")
        })

        const buffsFilter = this.createCheckbox('Hide Buffs', this.consumableSelection.hideBuffs, val => {
            this.consumableSelection.hideBuffs = val
            this.selectTab("consumables")
        })

        $("#energy_consumables", html).append(checkboxEnergyConsumes)
        $("#motivation_consumables", html).append(checkboxMotivationConsumes)
        $("#health_consumables", html).append(checkboxHealthConsumes)
        $("#buff_consumables", html).append(buffsFilter)
        htmlSkel.append(html)
        return htmlSkel
    },

    createStatisticsGui: function() {
        const offsetLeft = '.5rem'

        const statsBubbleStyle = `'
            padding: 1rem 2rem;
            border-radius: 10px;
            background-color: rgba(255, 255, 228, .3);
            position: relative;
            box-shadow: 0 0 5px rgba(0, 0, 0, .2)
        '`

        const pseudoHeadingStyle = `'
            display: block;
            width: calc(100% - ${offsetLeft});
            padding-left: ${offsetLeft};
            border-bottom: 1px solid black;
            margin-bottom: .5rem
        '`

        const refreshStats = `
            <div style=${statsBubbleStyle}>
                <b style=${pseudoHeadingStyle}>REFRESH COUNT</b>
                <p style='padding-left:${offsetLeft}'>Total in this session: ${ActivityObserver.refreshCount}</p>
            </div>
        `

        const html = $(`
            <div id='statistics_overview' style='padding: 0 2rem; display: grid; gap: 1rem'>
                <div style=${statsBubbleStyle}>
                    <b style=${pseudoHeadingStyle}>EXPERIENCE</b>
                    <p style='padding-left: ${offsetLeft}'>Total in this session: ${Vajda.formatNumber(Vajda.statistics.sessionXpCount)}</p>
                    <p style='padding-left: ${offsetLeft}'>Total overall: ${Vajda.formatNumber(Vajda.statistics.totalXpCount)}</p>
                </div>

                <div style=${statsBubbleStyle}>
                    <b style=${pseudoHeadingStyle}>MONEY</b>
                    <p style='padding-left: ${offsetLeft}'>Total in this session: ${Vajda.formatNumber(Vajda.statistics.sessionMoneyCount)}</p>
                    <p style='padding-left: ${offsetLeft}'>Total overall: ${Vajda.formatNumber(Vajda.statistics.totalMoneyCount)}</p>
                </div>

                <div style=${statsBubbleStyle}>
                    <b style=${pseudoHeadingStyle}>JOBS</b>
                    <p style='padding-left: ${offsetLeft}'>Total in this session: ${Vajda.formatNumber(Vajda.statistics.sessionJobsCount)}</p>
                    <p style='padding-left: ${offsetLeft}'>Total overall: ${Vajda.formatNumber(Vajda.statistics.totalJobsCount)}</p>
                </div>

                <div id='reset-button' style='position: absolute; right: 4rem; top: 40px; z-index: 1'></div>

                ${ActivityObserver.isEnabled ? refreshStats : ''}
            </div>
        `)

        const resetButton = new west.gui.Button('Reset session stats', () => {
            this.statistics = {
                ...this.statistics,
                sessionJobsCount: 0,
                sessionMoneyCount: 0,
                sessionXpCount: 0
            }

            VajdaStorageManager.saveStatistics()
            this.selectTab('stats')
        })
        html.find(`#reset-button`).append(resetButton.getMainDiv())

        return html
    },

    createSettingsGui: function() {
        const settings = this.settings
        const htmlSkel = $(`
            <div id='settings_overview' style='padding: 30px 10px 10px'>
                <div id='simple-settings' style='display: grid; grid-template-columns: 1fr 1fr'></div>
            </div>
        `)

        const simpleSettings = htmlSkel.find('#simple-settings')

        const manualLink = `
            <div onclick=Vajda.selectTab('manual') style="cursor: pointer; text-decoration: underline; position: absolute; top: 20px; right: 25px;">
                Open User Manual <svg style="width: 10px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>
            </div>
        `

        htmlSkel.append(manualLink)

        simpleSettings.append(this.createCheckbox('Add Energy', settings.addEnergy, val => {settings.addEnergy = val; VajdaStorageManager.saveSettings()} ))
        simpleSettings.append(this.createCheckbox('Add Motivation', settings.addMotivation, val => {settings.addMotivation = val; VajdaStorageManager.saveSettings()} ))
        simpleSettings.append(this.createCheckbox('Add Health', settings.addHealth, val => {settings.addHealth = val; VajdaStorageManager.saveSettings()} ))
        simpleSettings.append(this.createCheckbox('Optimize For Butt Plugs And Cake Decorations', ConsumablesManager.isOptimized, val => {ConsumablesManager.setIsOptimized(val); VajdaStorageManager.saveManagerSettings()} ))
        simpleSettings.append(this.createCheckbox('Remember Consumables Selection', settings.rememberSelection.consumables, val => {settings.rememberSelection.consumables = val; VajdaStorageManager.saveSettings()} ))
        simpleSettings.append(this.createCheckbox('Remember Travel Buff Selection', settings.rememberSelection.travelBuff, val => {settings.rememberSelection.travelBuff = val; VajdaStorageManager.saveSettings(); VajdaStorageManager.saveSelectedConsumables()} ))
        simpleSettings.append(this.createCheckbox('Remember Character Buff Selection', settings.rememberSelection.characterBuff, val => {settings.rememberSelection.characterBuff = val; VajdaStorageManager.saveSettings(); VajdaStorageManager.saveSelectedConsumables()} ))

        const style = (isOpen, maxHeight) => `'
            overflow: hidden;
            max-height: ${isOpen ? maxHeight : '0'}px;
            transition: max-height .5s;
        '`

        const nightshiftWorkerHTML = $(`
            <div>
                <div id='nightshiftworker-checkbox'></div>
                <div id='nightshiftworker-input' style=${style(this.nightshiftWorker.isEnabled, 60)}>
                    <div class='swap-time'>
                        Jobs swap time
                    </div>
                    <div class='job-count-limit'>
                        Select max 
                        <span></span>
                        jobs
                    </div>
                </div>
            </div>
        `)

        nightshiftWorkerHTML.find('#nightshiftworker-checkbox').append(this.createCheckbox('Enable Night Shift Worker', this.nightshiftWorker.isEnabled, val => {
            this.nightshiftWorker.isEnabled = val
            VajdaStorageManager.saveJobPoolSettings()
            $(`#nightshiftworker-input`).css('max-height', val ? '60px' : '0px')
        }))

        nightshiftWorkerHTML.find('#nightshiftworker-input .swap-time').append(this.createTextfield(this.nightshiftWorker.swapTime, e => {
            const regex = /^(\d{1,2}):(\d{2})$/
            const input = e.target.value
            if ( input.match(regex) ) {
                this.nightshiftWorker.swapTime = input
                VajdaStorageManager.saveJobPoolSettings()
            } else {
                new UserMessage('Incorrect time format', UserMessage.TYPE_ERROR).show()
            }
        }, 60))

        nightshiftWorkerHTML.find(`#nightshiftworker-input .job-count-limit span`).append(this.createTextfield(this.nightshiftWorker.limit, e => {
            const val = e.target.value
            if ( !this.isNumber(val) ) {
                new UserMessage(`A number is expected`, UserMessage.TYPE_ERROR).show()
                return
            }
            this.nightshiftWorker.limit = Number(val)
            VajdaStorageManager.saveJobPoolSettings()
        }, 60))

        simpleSettings.append(nightshiftWorkerHTML)

        const randomDelayCheckbox = this.createCheckbox('Random delay chance percentage', settings.randomDelay.isEnabled, val => {settings.randomDelay.isEnabled = val; VajdaStorageManager.saveSettings()})
        const randomDelayTextfield = this.createTextfield(settings.randomDelay.chance, e => {
            settings.randomDelay.chance = Number(e.target.value)
            VajdaStorageManager.saveSettings()
        }, 20)

        simpleSettings.append($('<div></div>').append(randomDelayCheckbox, randomDelayTextfield))
        

        const depositHTML = $(`
            <div>
                <div id='deposit-checkbox'></div>

                <div style=${style(this.settings.addDeposit.isEnabled, 30)} id='deposit-limit-input'>
                    Deposit when more than 
                </div>
            </div>
        `)

        const value = Number.isNaN(this.settings.addDeposit.limit) ? '' : this.settings.addDeposit.limit

        depositHTML.find('#deposit-checkbox').append(this.createCheckbox('Deposit money in your hometown', settings.addDeposit.isEnabled, val => {
            if ( Character.homeTown.town_id === 0 ) {
                new UserMessage("You don't have a home town", UserMessage.TYPE_HINT).show()
                return
            }

            settings.addDeposit.isEnabled = val
            VajdaStorageManager.saveSettings()

            $(`#deposit-limit-input`).css('max-height', val ? '30px' : '0px')
        }))

        depositHTML.find('#deposit-limit-input').append(this.createTextfield(value, e => {
            const val = e.target.value

            if ( this.isNumber(val) ) {
                this.settings.addDeposit.limit = val
                VajdaStorageManager.saveSettings()
            }
        }, 60))

        depositHTML.find('#deposit-limit-input').append(` $ in cash`)

        simpleSettings.append(depositHTML)

        const autoStopCheckbox = this.createCheckbox('Stop at', this.settings.autostop.isEnabled, val => {this.settings.autostop.isEnabled = val; VajdaStorageManager.saveSettings()})
        const autoStopTextfield = this.createTextfield(this.settings.autostop.time, e => {
            this.settings.autostop.time = e.target.value
            this.settings.autostop.date = this.getDateFromTimestring(e.target.value)
            VajdaStorageManager.saveSettings()
        })

        htmlSkel.append($(`<div></div>`).append(autoStopCheckbox, autoStopTextfield))

        const nannyCheckbox = this.createCheckbox('Finish and logout at', this.settings.nanny.isEnabled, val => {this.settings.nanny.isEnabled = val; VajdaStorageManager.saveSettings()})
        const nannyTextfield = this.createTextfield(this.settings.nanny.stopTime, e => {
            this.settings.nanny.stopTime = e.target.value
            this.settings.nanny.stopDate = this.getDateFromTimestring(e.target.value)
            VajdaStorageManager.saveSettings()
        }, 60)

        htmlSkel.append($(`<div></div>`).append(nannyCheckbox, nannyTextfield))

        const observerHTML = $(`
            <div>
                <div id='delay-checkbox'>
                
                </div>
                <div style=${style(ActivityObserver.isEnabled)} id='observer-delay-input'>
                    Refresh page after 
                </div>
            </div>
        `)
 
        observerHTML.find('#observer-delay-input').append(this.createTextfield(ActivityObserver.getTimeOut(true), e => {
            const val = e.target.value.replace(',', '.')

            if ( this.isNumber(val) ) {
                ActivityObserver.setTimeOut(val)
                VajdaStorageManager.saveObserverSettings()
            }
        }, 100))

        observerHTML.find('#observer-delay-input').append(` minutes since the last action`)
        
        observerHTML.find('#delay-checkbox').append(this.createCheckbox('[Experimental] Enable auto refresh → Read user manual', ActivityObserver.isEnabled, val => {
            ActivityObserver.setIsEnabled(() => {
                $('#observer-delay-input').css('max-height', val ? '30px' : '0px')

                this.isRunning && val && ActivityObserver.start(forceStart = true)
                this.isRunning && !val && ActivityObserver.stop()

                return val
            })

            VajdaStorageManager.saveObserverSettings()
        }))

        htmlSkel.append(observerHTML)
        
        const htmlHealthStop = $("<div>Stoppage health value </div>")
        htmlHealthStop.append(this.createTextfield(this.settings.minHP, e => {this.settings.minHP = Number(e.target.value); VajdaStorageManager.saveSettings()}, 60))
        
        htmlSkel.append(htmlHealthStop)

        const htmlSetWearDelay = $("<div>Job set equip delay </div>")
        htmlSetWearDelay.append(this.createTextfield(this.settings.setWearDelay, e => {this.settings.setWearDelay = Number(e.target.value); VajdaStorageManager.saveSettings()}, 60))

        htmlSkel.append(htmlSetWearDelay) 

        return htmlSkel
    },

    createManualGui: function() {
        const listStyle = `'padding-inline-start: 14px'`
        const nestedListStyle = `'padding-inline-start: 30px'`
        const containerStyle = `'
            padding: 0 30px 30px
        '`

        const html = $(`
            <div style=${containerStyle}>
                <h2>Read Before use</h3>
                <ol style=${listStyle}>
                    <li>
                        <strong>Calculating optimal route</strong> takes time and memory, a lot of it. It might not be noticeable for up to 12-14 jobs,
                        but anything more than that... you will notice a short freeze of the window. I don't recommend selecting more than 18 jobs, as the
                        algorithm will take about a minute (depending on the hardware, of course) to execute, while it takes almost 8 minutes to
                        find the best route for 20 jobs. In these scenarios, your browser may appear unresponsive and prompt you to reload the page 
                        or wait. I recommend being patient and allowing some time for the algorithm to complete. If that doesn't work, remove one
                        or two jobs; that's the cheapest way to solve this problem.
                    </li>

                    <li>
                        <strong>The optimization for butt plugs and cake decorations</strong> setting, which is most likely why you are here:
                        <ul style=${nestedListStyle}>
                            <li>The setting has to be enabled <i>before</i> you start Vajda, it won't work otherwise</li>
                            <li>The <i>Add motivation</i> setting has to be enabled as well</li>
                            <li>Do not start Vajda with low energy and consumables on cooldown</li>
                            <li>Do not use consumables yourself while it's running</li>
                            <li>
                                You don't have to select consumables manually with this setting, Vajda will do it for you. Just make sure
                                you have enough of them butt plugs and decorations
                            </li>
                        </ul>

                        These restrictions are simply the cost of having Vajda refill energy <i>while</i> doing jobs.
                    </li>

                    <li>
                        Vajda can <strong>travel</strong> to jobs that you can't do in travel set (unless you are super low level).
                    </li>

                    <li>
                        <strong>Buffs</strong> will be used automatically when selected (and when no buff is active, of course). Only one buff
                        of each type can be selected at once. Keep in mind that consumables with cooldown are <b>not</b> treated as buffs and will
                        only be used to refill whatever your character needs.
                    </li>

                    <li>
                        Vajda will display <strong>all silver jobs</strong>, not just those you can do and are closest to yoor character. This
                        allows you <i>some</i> control of the route, for instance there might be multiple silver jobs of the same kind and one 
                        of them might simply be in a more advantageous position.
                    </li>

                    <li>
                        When <strong>Auto Refresh</strong> is enabled, Vajda will refresh the page and start automatically <i>n</i> minutes
                        after starting a job (or walking to one). Starting new jobs will restart this countdown. Do not set the delay to low numbers,
                        Vajda enforces a minimum of 2.5 minutes anyway, however, I do recommend a slightly longer delay.
                    </li>
                </ol>
                <h3 style='margin:10px 0'>Farming Assistant</h3>
                <ol style=${listStyle}>
                    <li>
                        Farming assistant is available only when one job is added. It will spend all motivation on the selected job. If
                        the selected job is silver, Vajda will choose the nearest normal job, spend motivation there and come back to the selected
                        silver job to keep working like the slave it is.
                    </li>
                    <li>
                        Some jobs give less xp when your character has 0LP (sometimes 1 or even 2LP works as well). You will have to figure out
                        the set of clothes for each level on your own, however, once you have figured it out, you can export the sets to a file.
                        The next time you farm the very same job, you can simply import the settings from that file and you're good to go.

                        Feel free to ignore this option when you don't need specific sets for a specific level, Vajda will not change your equip when
                        no equip for a level is selected.
                    </li>
                    <li>
                        To save clothes set for a certain level, put it on your character, then select the level and hit the 'Save current clothes'
                        button (no shit, Sherlock). Omit step one to delete a set.
                    </li>
                    <li>
                        Vajda will not change into job set while spending motivation.
                    </li>
                    <li>
                        Please note that Vajda will use motivation consumables when selected. However, it won't use buffs when spending motivation.
                    </li>
                </ol>
                <h3 style='margin: 10px 0'>Night Shift Worker</h3>
                <ol style=${listStyle}>
                    <li>
                        Enable this setting to automatically refresh the page at the specified time to select new silver jobs.
                    </li>
                    <li>
                        <strong>Job Pool</strong> is the list of jobs Vajda will look for when swapping silver jobs. If any of the jobs in
                        job pool is silver, Vajda will select the job.
                    </li>
                    <li>
                        You have the option to keep a job even if not silver
                    </li>
                    <li>
                        Don't forget to select a set for the jobs (in the Job Pool tab). If, for any reason, you need a different set for
                        certain jobs, you have this option as well.
                    </li>
                    <li>
                        The <b>Select And Start</b> button will select jobs based on the job pool and start Vajda. 
                    </li>
                </ol>
            </div>
        `)

        const container = new west.gui.Scrollpane().getMainDiv()
        container.style = 'height: 400px; overflow-y: scroll'
        container.append(html.get(0))

        return container
    },

    addConsumableTableCss: function() {
        $(".vajda-window .consumIcon").css({"width":"80px"})
        $(".vajda-window .consumCount").css({"width":"60px"})
        $(".vajda-window .consumEnergy").css({"width":"60px"})
        $(".vajda-window .consumMotivation").css({"width":"70px"})
        $(".vajda-window .consumHealth").css({"width":"60px"})
        $(".vajda-window .consumBuffs").css({"width": "150px"})
        $(".vajda-window .row").css({"height":"80px"})
        $('.vajda-window').find('.tw2gui_scrollpane').css('height', '250px')
    },

    addJobTableCss: function() {
        $(".vajda-window .jobIcon").css({"width":"80px"})
        $(".vajda-window .jobName").css({"width":"150px"})
        $(".vajda-window .jobXp").css({"width":"40px"})
        $(".vajda-window .jobMoney").css({"width":"40px"})
        $(".vajda-window .jobMotivation").css({"width":"40px"})
        $(".vajda-window .jobDistance").css({"width":"100px"})
        $(".vajda-window .row").css({"height":"60px"})
        $('.vajda-window').find('.tw2gui_scrollpane').css('height', '250px')
    },

    addAddedJobsTableCss: function() {
        $(".vajda-window .jobIcon").css({"width":"80px"})
        $(".vajda-window .jobName").css({"width":"130px"})
        $(".vajda-window .jobStopMotivation").css({"width":"110px"})
        $(".vajda-window .jobRemove").css({"width":"105px"})
        $(".vajda-window .jobSet").css({"width":"100px"})
        $(".vajda-window .row").css({"height":"60px"})
        $('.vajda-window').find('.tw2gui_scrollpane').css('height', '250px')
    },
    
    createMenuIcon: function() {
        const menuImage = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAMAAAC7faEHAAAAPFBMVEVrkJ96n66DiINcgIyrWj3mhGSGRzL4nX9zeXWQl5H+up7Mbk0VCgxdaWuiq6Q6JSOBYlZGSkxfNy2ufGj5kWvyAAACxElEQVR4nFWUCZLsKAxE2RHG7Pe/62QKV/8Ywu6y4ZGSUqaNsdYYXvjl7Y3n5T3n+dCaN2YAwYy1mPhwgwV/9ynHYRaewNtLcL2Z/wHU+biL6bBtjLGK+cSVVGDp6p3D0xp7vy8TMtxtNWF79TT3O9lGzDnX0T5Ew3iuK0dh1VszP8+T07JXztivnF9+npusGcrFQMFLaOAb92amaY6JuDGkAQ/sTeXzYZjrSdepiSIwhlhy326Nvn6t0HQduIP7Qtf8f/m5XlpzpNtMNYaQjDpQrPl5Db3umrjmei+9m1ZrmvVcg68vdJpx8eMKdjhni5sH/sW9y5/Nt4laLwtC68WhWDgTxxtzPPIDi78cUnNi/IFUfM5AuSfTnlMKAn1VLiOCd+cPHM41P3GM88TIthzMO3H++tL5ViYQqET2gwx3hdIFQy1fBmriutSoQxFAEXuC9FIKQJCIW2wpftZ6yXxJPobJWmEYhJZhVPEzfBxAWhMjnRTBIsHOOhw2pPTD/sCQUmuskSy4xocQQr1iLEgx9M91lRNyBdr9YDMCM7MalaspheCMB8OWan7NnRrGBZHXlRvgJqKJg8GXE0G544VkCDEjgVrDfvE2oQZI83PwyMEVnLSNWICQw95jg2PrHG/lUDe/dWFGUMIFMjm8sXNcVl9gy4mMEQgGvSEt0K5N5YAwPxGm7iaWg7JpD2w7MIrfAdZFfRYJ+akTOpti5GrdgrMXYaCwH0X7IaxywpuLAcTjAlextmCgY38FEeGXrKreJpWtYS0cqYWvBcdM2iB3IDHlDVELQVg0e60FeKPBrfUuA/X2A6XSXnSANbKFeb9r0Wgc2NmQ4jBIUmLdbvIfwYYWx3iHctIWxCBKzrkanNT53jH0715rIz8ebjjDegviBtzPfv+NiTp2ZR3Emn7PkmJtsCb/gTvn1MClhZjS5mrjP4VqJ9/Eb24oAAAAAElFTkSuQmCC'
        let div = $('<div class="ui_menucontainer" />')
        let link = $(`<div id="vajda_menu" class="menulink" onclick=Vajda.loadJobs() title="Vajda Jožo" />`).css('background-image', 'url(' + menuImage + ')')
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'))
    },

    createWindow: function(isHumanAction = true) {
        const window = wman.open("vajda").setResizeable(false).setMinSize(740, 480).setSize(740, 480).setMiniTitle("Vajda Jožo")
        const tabs = {
            "jobs": "Jobs",
            "chosenJobs": "Chosen Jobs",
            "sets": "Sets",
            "jobPool": "Job Pool",
            "consumables": "Consumables",
            "stats": "Statistics",
            "settings": "Settings",
            "manual": "User Manual"
        }

        let tabLogic = (_, id) => {
            const content = $(`<div class='vajda-window'></div>`)
            switch(id) {
                case 'jobs': 
                    this.loadJobData(() => {
                        this.removeActiveTab(this)
                        this.removeWindowContent()
                        this.addActiveTab("jobs",this)
                        try {
                            content.append(this.createJobsTab())
                        } catch (e) {
                            console.log(e)
                            content.append(this.createErrorTab('jobs'))
                        }
                        this.window.appendToContentPane(content)
                        this.addJobTableCss()
                        $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css({"top": this.jobTablePosition.content})
                        $(".vajda-window .tw2gui_scrollbar_pulley").css({"top": this.jobTablePosition.scrollbar})
                        this.addEventsHeader()
                    })
                    break
                case 'chosenJobs': 
                    this.removeActiveTab(this)
                    this.removeWindowContent()
                    this.addActiveTab("chosenJobs", this)
                    content.append(this.createAddedJobsTab())
                    this.window.appendToContentPane(content)
                    $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css({"top": this.addedJobTablePosition.content})
                    $(".vajda-window .tw2gui_scrollbar_pulley").css({"top": this.addedJobTablePosition.scrollbar})
                    this.addAddedJobsTableCss()
                    break
                case 'jobPool':
                    this.removeActiveTab(this)
                    this.removeWindowContent()
                    this.addActiveTab("jobPool", this)
                    try {
                        content.append(this.createJobsPoolGui())
                    } catch (e){
                        console.log(e)
                        content.append(this.createErrorTab('jobPool'))
                    }
                    this.window.appendToContentPane(content)
                    break
                case 'sets': 
                    this.loadSets( () => {
                        this.removeActiveTab(this)
                        this.removeWindowContent()
                        this.addActiveTab("sets",this)
                        try {
                            content.append(this.createSetGui())
                        } catch (e) {
                            console.log(e)
                            content.append(this.createErrorTab('sets'))
                        }
                        this.window.appendToContentPane(content)
                    })
                    break
                case 'consumables': 
                    this.removeActiveTab(this)
                    this.removeWindowContent()
                    this.addActiveTab("consumables",this)
                    this.findAllConsumables()
                    content.append(this.createConsumablesTable())
                    this.window.appendToContentPane(content)
                    $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css({"top": this.consumableTablePosition.content})
                    $(".vajda-window .tw2gui_scrollbar_pulley").css({"top": this.consumableTablePosition.scrollbar})
                    this.addConsumableTableCss()
                    break
                case 'stats':
                    this.removeActiveTab(this)
                    this.removeWindowContent()
                    this.addActiveTab("stats",this)
                    content.append(this.createStatisticsGui())
                    this.window.appendToContentPane(content)
                    break
                case 'settings': 
                    this.removeActiveTab(this)
                    this.removeWindowContent()
                    this.addActiveTab("settings",this)
                    try {
                        content.append(this.createSettingsGui())
                    } catch(e) {
                        console.log(e)
                        content.append(this.createErrorTab('settings'))
                    }
                    this.window.appendToContentPane(content)
                    break
                case 'manual':
                    this.removeActiveTab(this)
                    this.removeWindowContent()
                    this.addActiveTab("manual", this)
                    content.append(this.createManualGui())
                    this.window.appendToContentPane(content)
                    break
            }
        }

        for(let tab in tabs) {
            window.addTab(tabs[tab],tab,tabLogic)
        }

        this.window = window

        if ( !isHumanAction ) wman.close('vajda')

        this.selectTab('jobs')
    }
}  

//window.Consumable = Consumable
//window.Buff = Buff
//window.Job = Job
//window.MotivationJob = MotivationJob
//window.JobPoolJob = JobPoolJob


$(document).ready(() => {
    try {
        VajdaStorageManager.loadAllInit()
        Vajda.loadLanguage()
        Vajda.loadSets()
        Vajda.createMenuIcon()
        ActivityObserver.resumeSession()
        Vajda.initSilverJobsSwap()
    } catch(e) {
        console.log(e)
        console.log("exception occured")
    }
})