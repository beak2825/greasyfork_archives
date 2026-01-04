// ==UserScript==
// @name         drawXpPieChart
// @version      3.5
// @description  Tracks and estimates hourly XP rate in Nitro Type races
// @author       TensorFlow - Dvorak
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @license      MIT
// ==/UserScript==

function drawXpPieChart() {
  const canvas = document.getElementById('xpPieChart');
  const ctx = canvas.getContext('2d');

  const data = [
    { label: 'Placement', value: xpCategories.placement, cumulative: cumulativeXpCategories.placement, color: '#ff6384' },
    { label: 'Accuracy', value: xpCategories.accuracy, cumulative: cumulativeXpCategories.accuracy, color: '#36a2eb' },
    { label: 'Wampus', value: xpCategories.wampus, cumulative: cumulativeXpCategories.wampus, color: '#cc65fe' },
    { label: 'Friends', value: xpCategories.friends, cumulative: cumulativeXpCategories.friends, color: '#4caf50' },
    { label: 'Gold Bonus', value: xpCategories.goldBonus, cumulative: cumulativeXpCategories.goldBonus, color: '#ffeb3b' },
    { label: 'Speed', value: xpCategories.speed, cumulative: cumulativeXpCategories.speed, color: '#f44336' },
    { label: 'Other', value: xpCategories.other, cumulative: cumulativeXpCategories.other, color: '#ffce56' }
  ].filter(category => category.value > 0); // Filter out categories with value 0

  const total = data.reduce((acc, category) => acc + category.value, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let startAngle = 0;
  data.forEach(category => {
    const sliceAngle = (category.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(150, 150); // Adjusted for smaller canvas
    ctx.arc(150, 150, 150, startAngle, startAngle + sliceAngle); // Adjusted for smaller canvas
    ctx.closePath();
    ctx.fillStyle = category.color;
    ctx.fill();

    // Draw labels centered within the slice and as far away from the center as possible
    const midAngle = startAngle + sliceAngle / 2;
    const labelX = 150 + (150 - 20) * Math.cos(midAngle); // Adjusted for smaller canvas
    const labelY = 150 + (150 - 20) * Math.sin(midAngle); // Adjusted for smaller canvas
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "bold 12px Arial";
    ctx.fillText(`${category.label} (${formatNumber(category.cumulative)})`, labelX, labelY);

    startAngle += sliceAngle;
  });
}

