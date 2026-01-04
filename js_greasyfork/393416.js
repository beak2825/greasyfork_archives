// ==UserScript==
// @name     Garmin Connect Workout - Copy Workout Step
// @description Adds a clickable '+' icon to top left of each workout step that creates a copy of that step.
// @author Do Om
// @namespace https://connect.garmin.com
// @include https://connect.garmin.com/modern/workout/*
// @include https://connect.garmin.com/modern/workout/edit/*
// @version  1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/393416/Garmin%20Connect%20Workout%20-%20Copy%20Workout%20Step.user.js
// @updateURL https://update.greasyfork.org/scripts/393416/Garmin%20Connect%20Workout%20-%20Copy%20Workout%20Step.meta.js
// ==/UserScript==

var style = document.createElement('style')
style.innerHTML = `
#cloneBtn {
  float: left;
  position: relative;
  margin-left: 6px;
  margin-top: 1px%;
  cursor: pointer;
}`;
document.head.appendChild(style)

idList = []
cloned = false
workoutType = null
workoutSelect = {
  "workout-step-warm": 0,
  "workout-step-run": 1,
  "workout-step-recover": 2,
  "workout-step-rest": 3,
  "workout-step-cool": 4,
  "workout-step-other": 5
}

durationSelect = {
  1:"step-duration-time",
  2:"step-duration-distance",
  3:"step-duration-lap-button",
  4:"step-duration-cal",
  5:"step-duration-hr"
}
durationIdx = null
durationTime = null
durationUnit = null

//#duration-distance
durationValue = null
durationOption = null

targetExists = false
stepTargetValue = null
stepTargetIdx = null
heartRateIdx = null
targetValue = null
targetFrom = null
targetTo = null

function createCloneBtn() {
  var div = document.createElement('span')
  div.setAttribute('id', 'cloneBtn')
  div.setAttribute('class', 'has-tooltip')
  //div.classList.add('pull-left')
 
  let clone = document.createElement('a')
  clone.classList.add('cloneBtn')
  clone.innerHTML = '+'
  div.append(clone)
  
  clone.onclick = function() {
    cloned = true
    let currStep = this.parentNode.parentNode
    workoutType = currStep.classList[1]
    
    //TODO: change these to value instead of index
    let duration = currStep.querySelector('.select-step-duration')
    durationIdx = duration.selectedIndex
    let durationDiv = currStep.querySelector('.step-duration')
    switch(duration.value) {
      case 'time':
        durationValue = durationDiv.querySelector('input[name="duration-time"]').value
        durationOption = null
        break
      case 'distance':
        durationValue = durationDiv.querySelector('input[name="duration-distance"]').value
        durationOption = durationDiv.querySelector('select[name="distanceUnit"]').value

        break
      case 'lap.button':
        durationValue = null
        durationOption = null
        break
      case 'calories':
        durationValue = durationDiv.querySelector('input[name="duration-calories"]').value
        durationOption = null
        break
      case 'heart.rate.zone':
        durationOption = durationDiv.querySelector('select[name="heart-rate-select"]').value
        durationValue = durationDiv.querySelector('input[name="duration-heart-rate-custom"]').value
        break
      default:
        durationValue = null
        durationOption = null
        break
    }
    
    var stepTargetSelect = currStep.querySelector('.select-step-target')
    stepTargetValue = stepTargetSelect.value
    stepTargetIdx = stepTargetSelect.selectedIndex
    
    var stepTargetDiv = currStep.querySelector('.step-target')
    addMore = currStep.querySelector('#add-step-target')
    if(addMore.classList.contains('hide') && stepTargetSelect.value != 'no.target') {

      targetValue = stepTargetSelect.value

      switch(targetValue) {
        case 'pace.zone':
          targetExists = true
          //console.log('pace.zone')
          targetFrom = stepTargetDiv.querySelector('input[name="target-pace-from"]').value
          targetTo = stepTargetDiv.querySelector('input[name="target-pace-to"]').value
          break
        case 'speed.zone':
          targetExists = true
          targetFrom = stepTargetDiv.querySelector('input[name="target-speed-from"]').value
          targetTo = stepTargetDiv.querySelector('input[name="target-speed-to"]').value
          break
        case 'cadence':
          targetExists = true
          targetFrom = stepTargetDiv.querySelector('input[name="target-cadence-from"]').value
          targetTo = stepTargetDiv.querySelector('input[name="target-cadence-to"]').value
          break
        case 'heart.rate.zone':
          targetExists = true
          heartRateIdx = stepTargetSelect.selectedIndex
          
          if(heartRateIdx == 9) {
            targetFrom = stepTargetDiv.querySelector('input[name="target-heart-rate-custom-from"]').value
            targetTo = stepTargetDiv.querySelector('input[name="target-heart-rate-custom-to"]').value
          }
          break
        default:
          targetExists = false
          break
      }
    } else {
      //console.log('nottarget')
    }
    
    var newStepBtn = document.querySelector('#new-step')
    newStepBtn.click()
   
  }
  return div
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    
      if(mutation.target.classList.contains('workout-edit')) {
      //if (!mutation.addedNodes) return
      var steps = mutation.target.querySelectorAll('.workout-step')
    
    
      for (var i = 0; i < steps.length; i++) {
       var node = steps[i]
      
       if(node.querySelector('#cloneBtn') == null) {
          node.prepend(createCloneBtn())
        }
      }     
  }
    

    
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      var node = mutation.addedNodes[i]
      
      if(node.classList.contains('workout-step') && cloned == true) {
        let workoutIdx = workoutSelect[workoutType]
        let stepType = node.querySelector('.select-step-type')
        stepType.selectedIndex = workoutIdx
        stepType.dispatchEvent(new Event('change', { bubbles: true }))
        let stepDefine = node.querySelector('.step-define')
        
        let duration = node.querySelector('.select-step-duration')
        duration.selectedIndex = durationIdx
        duration.dispatchEvent(new Event('change', { bubbles: true }))
        let durationDiv = node.querySelector('.step-duration')

        switch(duration.value) {
          case 'time': {
            let input = durationDiv.querySelector('input[name="duration-time"]')
            input.value = durationValue
            input.dispatchEvent(new Event('change', { bubbles: true }))
            
          } break
          case 'distance': {
            let input = durationDiv.querySelector('input[name="duration-distance"]') 
            input.value = durationValue
            input.dispatchEvent(new Event('change', { bubbles: true }))
            let option = durationDiv.querySelector('select[name="distanceUnit"]') 
            option.value = durationOption
            option.dispatchEvent(new Event('change', { bubbles: true }))
          } break
          case 'lap.button':
            break
          case 'calories': {
            let input = durationDiv.querySelector('input[name="duration-calories"]')
            input.value = durationValue
            input.dispatchEvent(new Event('change', { bubbles: true }))            
          } break
          case 'heart.rate.zone': {
            let option = durationDiv.querySelector('select[name="heart-rate-select"]')
            option.value = durationOption
            option.dispatchEvent(new Event('change', { bubbles: true }))

            let input = durationDiv.querySelector('input[name="duration-heart-rate-custom"]')
            input.value = durationValue
            input.dispatchEvent(new Event('change', { bubbles: true }))
          } break
          default:
            break
        }
        
        var stepTargetSelect = node.querySelector('.select-step-target')
        
        var stepTargetDiv = node.querySelector('.step-target')
        
        if(targetExists == true) {
           let addMore = node.querySelector('#add-step-target')
           addMore.click()
        }
        stepTargetSelect.selectedIndex = stepTargetIdx
        stepTargetSelect.dispatchEvent(new Event('change', { bubbles: true }));
        stepTargetDiv.dispatchEvent(new Event('change', { bubbles: true }));
        let targetValue = stepTargetSelect.value 
        switch(targetValue) {
          case 'pace.zone': {
            let inputFrom = stepTargetDiv.querySelector('input[name="target-pace-from"]')
            inputFrom.value = targetFrom
            inputFrom.dispatchEvent(new Event('change', { bubbles: true }))
            let inputTo = stepTargetDiv.querySelector('input[name="target-pace-to"]')
            inputTo.value = targetTo
            inputTo.dispatchEvent(new Event('change', { bubbles: true }))
          } break
          case 'speed.zone': {
            let inputFrom = stepTargetDiv.querySelector('input[name="target-speed-from"]')
            inputFrom.value = targetFrom
            inputFrom.dispatchEvent(new Event('change', { bubbles: true }))
            
            let inputTo = stepTargetDiv.querySelector('input[name="target-speed-to"]')
            inputTo.value = targetTo
            inputTo.dispatchEvent(new Event('change', { bubbles: true }))
          } break
          case 'cadence': {
            let inputFrom = stepTargetDiv.querySelector('input[name="target-cadence-from"]')
            inputFrom.value = targetFrom
            inputFrom.dispatchEvent(new Event('change', { bubbles: true }))
            
            let inputTo = stepTargetDiv.querySelector('input[name="target-cadence-to"]')
            inputTo.value = targetTo
            inputTo.dispatchEvent(new Event('change', { bubbles: true }))
          } break
          case 'heart.rate.zone': {
            if(heartRateIdx == 9) {
              let inputFrom = stepTargetDiv.querySelector('input[name="target-heart-rate-custom-from"]')
              inputFrom.value = targetFrom
              inputFrom.dispatchEvent(new Event('change', { bubbles: true }))
              
              let inputTo = stepTargetDiv.querySelector('input[name="target-heart-rate-custom-to"]')
              inputTo.value = targetTo
              inputTo.dispatchEvent(new Event('change', { bubbles: true }))
            }
          } break
          default:
            break
        }
        // Add clone button
        let div = createCloneBtn()
        node.prepend(div)
        
      }
      targetExists = false
      cloned = false
      
    }
  })
})

observer.observe(document.body, {
    childList: true
  , subtree: true
  , attributes: false
  , characterData: false
})

//observer.disconnect()



