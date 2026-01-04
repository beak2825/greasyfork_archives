function start() {
  // if trying to start. But already running. Stop first
  if(loopRunning) {
    clearInterval(loop)
    console.log('Aimbot Restarted')
  } else {
    console.log('Aimbot Started')
  }
  // Main loop
  loop = setInterval(async () => {
    loopRunning = true
    loopCount++

    if(loopCount % 50 == 0) {
      timeData.screenshot.start = Date.now()
      let newEnemyPos = await getEnemyPos()
      timeData.screenshot.end = Date.now() - timeData.screenshot.start
      if(newEnemyPos == 0) {
        enemyOnScreen = false
      }
      else {
        enemyOnScreen = true
        enemyPositions.push({pos: newEnemyPos, time: Date.now()})
        calculateEnemyVelocity()
      }
    }

    predictedEnemyPos = predictEnemyPos()
    if(enemyOnScreen || keys[42]) {
      if(predictedEnemyPos != 0) {
        if(autoAim || keys[42]) {
          let shootPos = {x: 0, y:0}
          shootPos.x = predictedEnemyPos.x
          shootPos.y = predictedEnemyPos.y

          shootPos.x -= screenSize.x/2
          shootPos.y -= screenSize.y/2
          magnitude = Math.sqrt((shootPos.x)**2 + (shootPos.y)**2)
          shootPos.x = screenSize.x/2 + shootPos.x/magnitude * shootCircle
          shootPos.y = screenSize.y/2 + shootPos.y/magnitude * shootCircle

          shootPos.y += 30
          user32.SetCursorPos(Math.round(shootPos.x), Math.round(shootPos.y))
        }
        if(autoShoot || keys[42]) {
          user32.mouse_event(2, 0, 0, 0, 0)
          mouseDown = true
        }
      }
    }
    // mouseUp when no1 on screen
    if(!enemyOnScreen && mouseDown) user32.mouse_event(4, 0, 0, 0, 0)
  }, 2)

 
  // send drawData to client
  setInterval(() => {
    let drawData = {
      predictedEnemyPos: predictedEnemyPos,
      enemyPositions: enemyPositions,
      enemyVelocity: enemyVelocity,
      enemyOnScreen: enemyOnScreen
    }
    socket.emit('drawData', drawData)
  }, 50)

}