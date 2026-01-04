// ==UserScript==
// @name        Ping Pong no Footmundo
// @description adiciona um ping pong nos itens do footmundo
// @namespace   Vicente Ayuso
// @author      Vicente Ayuso
// @version     1.0
// @match       https://www.footmundo.com/itens/jogador/*
// @grant       none
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/463716/Ping%20Pong%20no%20Footmundo.user.js
// @updateURL https://update.greasyfork.org/scripts/463716/Ping%20Pong%20no%20Footmundo.meta.js
// ==/UserScript==

$(document).ready(function () {

    // Adicionar estilos CSS
    let styles = `
        <style>
            details {
                font-family: Arial, sans-serif;
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 10px;
            }
            summary {
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                outline: none;
            }
            #div-pingpong {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            #btn-iniciar {
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 8px 16px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 4px;
            }
            #nivel-dificuldade {
                font-size: 14px;
                padding: 8px;
                margin: 4px 2px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
        </style>
    `;

    // Inserir estilos CSS no documento
    $('head').append(styles);



    // Inserir detalhes, resumo e div
    $('span:contains("Você está atualmente carregando os seguintes objetos:")').append(
        '<details><summary>Jogar Ping Pong</summary><div id="div-pingpong"></div></details>'
    );

    // Inserir menu do jogo
    $('#div-pingpong').append(`
        <button id="btn-iniciar">Iniciar</button>
        <select id="nivel-dificuldade">
            <option value="1">Nível 1</option>
            <option value="2">Nível 2</option>
        </select>
        <canvas id="pingpong-canvas" width="500" height="270"></canvas>
    `);

    // Inicializar variáveis do jogo
    let canvas = document.getElementById('pingpong-canvas');
    let ctx = canvas.getContext('2d');
    let paddleWidth = 8;
    let paddleHeight = 50;
    let paddleSpeed = 4;
    let ballRadius = 5;
    let ballSpeedX = 4;
    let ballSpeedY = 4;
    let isGameRunning = false;
    let cpuY = canvas.height / 2 - paddleHeight / 2;
    let userY = cpuY;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let userScore = 0;
    let cpuScore = 0;


    function drawTable() {
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
    }
    // Desenhar elementos
    function drawPaddle(x, y) {
        ctx.beginPath();
        ctx.rect(x, y, paddleWidth, paddleHeight);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
    // Função para resetar o jogo
    function resetGame() {
        isGameRunning = false;
        $('#btn-iniciar').text('Iniciar');
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 4;
        ballSpeedY = 4;
        userScore = 0;
        cpuScore = 0;
    }

    function drawScore() {
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(userScore, canvas.width / 4, 30);
        ctx.fillText(cpuScore, (canvas.width / 4) * 3, 30);
    }

    function drawBall(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTable();
        if (isGameRunning) {
            // Atualizar posição da CPU
            let cpuSpeed = $('#nivel-dificuldade').val() == '2' ? paddleSpeed * 1.5 : paddleSpeed;
            if (ballY > cpuY + paddleHeight / 2) {
                cpuY += cpuSpeed;
            } else if (ballY < cpuY + paddleHeight / 2) {
                cpuY -= cpuSpeed;
            }

            // Limitar a posição da CPU
            cpuY = Math.max(Math.min(cpuY, canvas.height - paddleHeight), 0);

            // Atualizar posição da bola
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Detectar colisões com as paredes
            if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
                ballSpeedY = -ballSpeedY;
            }

            // Detectar colisões com as raquetes
            if (
                (ballX - ballRadius < paddleWidth && ballY > userY && ballY < userY + paddleHeight) ||
                (ballX + ballRadius > canvas.width - paddleWidth && ballY > cpuY && ballY < cpuY + paddleHeight)
            ) {
                ballSpeedX = -ballSpeedX;

                // Ajustar velocidade da bola com base na dificuldade
                if ($('#nivel-dificuldade').val() == '2') {
                    ballSpeedX *= 1.1;
                    ballSpeedY *= 1.1;
                }
            }

            // Detectar quando a bola sai do campo
            if (ballX + ballRadius < 0 || ballX - ballRadius > canvas.width) {
                // Atualizar pontuação
                if (ballX + ballRadius < 0) {
                    cpuScore++;
                } else {
                    userScore++;
                }
                // Reiniciar a posição da bola
                ballX = canvas.width / 2;
                ballY = canvas.height / 2;
                ballSpeedX = -ballSpeedX;
                ballSpeedY = -ballSpeedY;

                // Redefinir a velocidade da bola para a velocidade padrão
                ballSpeedX = 4 * (ballSpeedX > 0 ? 1 : -1);
                ballSpeedY = 4 * (ballSpeedY > 0 ? 1 : -1);
            }
        }
        drawPaddle(0, userY);
        drawPaddle(canvas.width - paddleWidth, cpuY);
        drawBall(ballX, ballY);
        drawScore();

    }


    // Atualizar a posição do usuário
    canvas.addEventListener('mousemove', (e) => {
        userY = e.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;
        userY = Math.max(Math.min(userY, canvas.height - paddleHeight), 0);
    });


    // Iniciar e parar o jogo
    $('#btn-iniciar').click(function () {
        isGameRunning = !isGameRunning;
        if (isGameRunning) {
            $(this).text('Parar');
        } else {
            $(this).text('Iniciar');
        }
    });
      // Mudar a dificuldade
    $('#nivel-dificuldade').change(function () {
        resetGame();
    });

    // Atualizar o jogo
    setInterval(draw, 1000 / 60);
});
